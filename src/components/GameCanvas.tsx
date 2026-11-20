// Komponen kanvas permainan utama yang menjalankan simulasi fisika Matter.js, kontrol bidik-jatuh, penggabungan, dan cek bahaya.

import { AlertTriangle } from 'lucide-react';
import Matter from 'matter-js';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { GAME_CONFIG, getSnackTier } from '../config';
import {
  cekMelewatiGarisBahaya,
  clampBodyPosition,
  clampDropX,
  hitungHasilMerge,
  hitungTimerBahaya,
  type SnackPhysicsSnapshot,
} from '../lib/gameRules';
import {
  drawAimingGuide,
  drawDangerLine,
  drawParticlesAndScores,
  drawSnack,
  type FloatingScore,
  type MergeParticle,
} from '../lib/snackRenderer';
import { soundEngine } from '../lib/sound';

interface SnackBodyMeta {
  tier: number;
  radius: number;
  droppedAtMs: number;
}

interface GameCanvasProps {
  sessionId: number;
  activeTier: number;
  isGameOver: boolean;
  onSnackDropped: () => void;
  onAddScore: (points: number) => void;
  onGameOver: () => void;
}

export function GameCanvas({
  sessionId,
  activeTier,
  isGameOver,
  onSnackDropped,
  onAddScore,
  onGameOver,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [displaySize, setDisplaySize] = useState<{ width: number; height: number }>({
    width: GAME_CONFIG.containerWidth,
    height: GAME_CONFIG.containerHeight,
  });
  const [isDangerActive, setIsDangerActive] = useState(false);

  // Refs agar loop animasi selalu membaca state terbaru tanpa membuat ulang Engine.
  const activeTierRef = useRef(activeTier);
  const isGameOverRef = useRef(isGameOver);
  const onSnackDroppedRef = useRef(onSnackDropped);
  const onAddScoreRef = useRef(onAddScore);
  const onGameOverRef = useRef(onGameOver);

  activeTierRef.current = activeTier;
  isGameOverRef.current = isGameOver;
  onSnackDroppedRef.current = onSnackDropped;
  onAddScoreRef.current = onAddScore;
  onGameOverRef.current = onGameOver;

  const engineRef = useRef<Matter.Engine | null>(null);
  const snackMetaMapRef = useRef<Map<number, SnackBodyMeta>>(new Map());
  const simTimeMsRef = useRef(0);
  const dangerTimerMsRef = useRef(0);
  const lastDropTimeRef = useRef(-GAME_CONFIG.dropCooldownMs);
  const aimXRef = useRef(GAME_CONFIG.containerWidth / 2);
  const isPointerDownRef = useRef(false);
  const canDropRef = useRef(true);
  const particlesRef = useRef<MergeParticle[]>([]);
  const floatingScoresRef = useRef<FloatingScore[]>([]);
  const dangerBannerRef = useRef(false);

  // Hitung ukuran kanvas responsif agar muat di 360x740 px tanpa menggulir.
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxAvailW = Math.min(vw - 24, GAME_CONFIG.containerWidth);
      const reservedVerticalChrome = vw < 640 ? 176 : 210;
      const maxAvailH = Math.max(280, vh - reservedVerticalChrome);
      const scale = Math.min(
        maxAvailW / GAME_CONFIG.containerWidth,
        maxAvailH / GAME_CONFIG.containerHeight,
        1,
      );
      setDisplaySize({
        width: Math.floor(GAME_CONFIG.containerWidth * scale),
        height: Math.floor(GAME_CONFIG.containerHeight * scale),
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const spawnBurst = useCallback((x: number, y: number, color: string, points: number, isBonus: boolean) => {
    const count = isBonus ? 22 : 12;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const speed = (isBonus ? 2.4 : 1.4) + Math.random() * 2.2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        radius: (isBonus ? 4.5 : 3) + Math.random() * 2.5,
        color: isBonus && i % 2 === 0 ? '#D32F2F' : color,
        alpha: 1,
        lifeMs: 0,
        maxLifeMs: isBonus ? 650 : 420,
      });
    }

    floatingScoresRef.current.push({
      x,
      y: Math.max(24, y - 10),
      text: `+${points}`,
      color: isBonus ? '#C2410C' : '#3E2723',
      lifeMs: 0,
      maxLifeMs: 750,
    });
  }, []);

  const createSnackBody = useCallback(
    (tier: number, x: number, y: number, droppedAtMs: number): Matter.Body => {
      const config = getSnackTier(tier);
      const body = Matter.Bodies.circle(x, y, config.radius, {
        restitution: GAME_CONFIG.physics.restitution,
        friction: GAME_CONFIG.physics.friction,
        frictionStatic: GAME_CONFIG.physics.frictionStatic,
        frictionAir: GAME_CONFIG.physics.frictionAir,
        density: GAME_CONFIG.physics.density,
        label: `snack_${tier}`,
      });
      snackMetaMapRef.current.set(body.id, {
        tier,
        radius: config.radius,
        droppedAtMs,
      });
      return body;
    },
    [],
  );

  // Inisialisasi ulang dunia fisika setiap kali sesi baru dimulai.
  useEffect(() => {
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: GAME_CONFIG.physics.gravityY, scale: 0.001 },
      positionIterations: 10,
      velocityIterations: 8,
    });

    const w = GAME_CONFIG.containerWidth;
    const h = GAME_CONFIG.containerHeight;
    const t = GAME_CONFIG.wallThickness;

    const wallOptions: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      friction: 0.5,
      restitution: 0.15,
      label: 'wall',
    };

    const leftWall = Matter.Bodies.rectangle(-t / 2, h / 2, t, h * 2, wallOptions);
    const rightWall = Matter.Bodies.rectangle(w + t / 2, h / 2, t, h * 2, wallOptions);
    const floor = Matter.Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, wallOptions);

    Matter.World.add(engine.world, [leftWall, rightWall, floor]);

    engineRef.current = engine;
    snackMetaMapRef.current.clear();
    simTimeMsRef.current = 0;
    dangerTimerMsRef.current = 0;
    lastDropTimeRef.current = -GAME_CONFIG.dropCooldownMs;
    aimXRef.current = w / 2;
    canDropRef.current = true;
    particlesRef.current = [];
    floatingScoresRef.current = [];
    dangerBannerRef.current = false;
    setIsDangerActive(false);

    const mergedIdsInStep = new Set<number>();

    const handleCollisions = (event: Matter.IEventCollision<Matter.Engine>) => {
      if (isGameOverRef.current) {
        return;
      }

      for (const pair of event.pairs) {
        const { bodyA, bodyB } = pair;
        if (bodyA.isStatic || bodyB.isStatic) {
          continue;
        }
        if (mergedIdsInStep.has(bodyA.id) || mergedIdsInStep.has(bodyB.id)) {
          continue;
        }

        const metaA = snackMetaMapRef.current.get(bodyA.id);
        const metaB = snackMetaMapRef.current.get(bodyB.id);
        if (!metaA || !metaB || metaA.tier !== metaB.tier) {
          continue;
        }

        mergedIdsInStep.add(bodyA.id);
        mergedIdsInStep.add(bodyB.id);

        Matter.World.remove(engine.world, bodyA);
        Matter.World.remove(engine.world, bodyB);
        snackMetaMapRef.current.delete(bodyA.id);
        snackMetaMapRef.current.delete(bodyB.id);

        const outcome = hitungHasilMerge(metaA.tier, bodyA.position, bodyB.position);
        onAddScoreRef.current(outcome.points);

        if (outcome.isTumpengBonus) {
          soundEngine.playTumpengBonus();
          spawnBurst(outcome.x, outcome.y, '#FFD54F', outcome.points, true);
        } else if (outcome.nextTier !== null) {
          const nextConfig = getSnackTier(outcome.nextTier);
          soundEngine.playMerge(metaA.tier);
          spawnBurst(outcome.x, outcome.y, nextConfig.color, outcome.points, false);

          const ageA = simTimeMsRef.current - metaA.droppedAtMs;
          const ageB = simTimeMsRef.current - metaB.droppedAtMs;
          const inheritedDroppedAt =
            ageA > GAME_CONFIG.dangerGraceAfterDropMs &&
            ageB > GAME_CONFIG.dangerGraceAfterDropMs
              ? simTimeMsRef.current - GAME_CONFIG.dangerGraceAfterDropMs - 1
              : Math.max(metaA.droppedAtMs, metaB.droppedAtMs);

          const mergedBody = createSnackBody(
            outcome.nextTier,
            outcome.x,
            outcome.y,
            inheritedDroppedAt,
          );
          Matter.World.add(engine.world, mergedBody);
        }
      }
    };

    Matter.Events.on(engine, 'collisionStart', handleCollisions);
    Matter.Events.on(engine, 'collisionActive', handleCollisions);

    let rafId = 0;
    let lastTimestamp = performance.now();
    let accumulator = 0;
    const fixedStepMs = 1000 / 60;

    const tick = (now: number) => {
      const rawDt = Math.min(50, Math.max(0, now - lastTimestamp));
      lastTimestamp = now;

      if (!isGameOverRef.current) {
        accumulator += rawDt;
        while (accumulator >= fixedStepMs) {
          mergedIdsInStep.clear();
          Matter.Engine.update(engine, fixedStepMs);
          simTimeMsRef.current += fixedStepMs;
          accumulator -= fixedStepMs;

          // Pastikan tidak ada badan yang menembus dinding wadah.
          for (const body of engine.world.bodies) {
            if (body.isStatic) {
              continue;
            }
            const meta = snackMetaMapRef.current.get(body.id);
            if (!meta) {
              continue;
            }
            const clamped = clampBodyPosition(
              body.position.x,
              body.position.y,
              meta.radius,
            );
            if (
              clamped.x !== body.position.x ||
              clamped.y !== body.position.y
            ) {
              Matter.Body.setPosition(body, clamped);
              Matter.Body.setVelocity(body, {
                x: clamped.x !== body.position.x ? 0 : body.velocity.x,
                y: clamped.y !== body.position.y ? 0 : body.velocity.y,
              });
            }
          }
        }

        // Cek status garis bahaya tiap frame.
        const snapshots: SnackPhysicsSnapshot[] = [];
        for (const body of engine.world.bodies) {
          if (body.isStatic) {
            continue;
          }
          const meta = snackMetaMapRef.current.get(body.id);
          if (meta) {
            snapshots.push({
              x: body.position.x,
              y: body.position.y,
              radius: meta.radius,
              droppedAtMs: meta.droppedAtMs,
            });
          }
        }

        const crossing = cekMelewatiGarisBahaya(snapshots, simTimeMsRef.current);
        const timerResult = hitungTimerBahaya(
          dangerTimerMsRef.current,
          crossing,
          rawDt,
        );
        dangerTimerMsRef.current = timerResult.nextTimerMs;

        if (crossing !== dangerBannerRef.current) {
          dangerBannerRef.current = crossing;
          setIsDangerActive(crossing);
        }

        if (timerResult.isGameOver) {
          soundEngine.stopMusic();
          soundEngine.playGameOver();
          onGameOverRef.current();
        }
      }

      // Perbarui partikel dan teks poin melayang.
      particlesRef.current = particlesRef.current
        .map((p) => {
          const nextLife = p.lifeMs + rawDt;
          return {
            ...p,
            x: p.x + p.vx * (rawDt / 16.67),
            y: p.y + p.vy * (rawDt / 16.67),
            vy: p.vy + 0.08 * (rawDt / 16.67),
            lifeMs: nextLife,
            alpha: 1 - nextLife / p.maxLifeMs,
          };
        })
        .filter((p) => p.lifeMs < p.maxLifeMs);

      floatingScoresRef.current = floatingScoresRef.current
        .map((fs) => ({
          ...fs,
          y: fs.y - 0.55 * (rawDt / 16.67),
          lifeMs: fs.lifeMs + rawDt,
        }))
        .filter((fs) => fs.lifeMs < fs.maxLifeMs);

      // Gambar seluruh kanvas.
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const targetW = GAME_CONFIG.containerWidth * dpr;
        const targetH = GAME_CONFIG.containerHeight * dpr;
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.fillStyle = GAME_CONFIG.canvasBgColor;
          ctx.fillRect(0, 0, GAME_CONFIG.containerWidth, GAME_CONFIG.containerHeight);

          const isDangerWarning = dangerTimerMsRef.current > 0;
          const dangerProgress = dangerTimerMsRef.current / GAME_CONFIG.dangerLimitMs;
          drawDangerLine(ctx, isDangerWarning, now * 0.008, dangerProgress);

          // Gambar jajanan aktif jika tidak sedang cooldown dan game belum berakhir.
          const cooldownElapsed = simTimeMsRef.current - lastDropTimeRef.current;
          const readyToDrop =
            !isGameOverRef.current && cooldownElapsed >= GAME_CONFIG.dropCooldownMs;
          canDropRef.current = readyToDrop;

          if (readyToDrop) {
            const activeConfig = getSnackTier(activeTierRef.current);
            const clampedAim = clampDropX(aimXRef.current, activeConfig.radius);
            drawAimingGuide(ctx, activeTierRef.current, clampedAim, GAME_CONFIG.spawnY);
          }

          // Gambar seluruh jajanan di dunia fisika.
          for (const body of engine.world.bodies) {
            if (body.isStatic) {
              continue;
            }
            const meta = snackMetaMapRef.current.get(body.id);
            if (!meta) {
              continue;
            }
            drawSnack(ctx, meta.tier, body.position.x, body.position.y, body.angle);
          }

          drawParticlesAndScores(ctx, particlesRef.current, floatingScoresRef.current);
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      Matter.Events.off(engine, 'collisionStart', handleCollisions);
      Matter.Events.off(engine, 'collisionActive', handleCollisions);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      engineRef.current = null;
    };
  }, [sessionId, createSnackBody, spawnBurst]);

  const updateAimFromEvent = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0) {
      return;
    }
    const rawX = ((e.clientX - rect.left) / rect.width) * GAME_CONFIG.containerWidth;
    const activeConfig = getSnackTier(activeTierRef.current);
    aimXRef.current = clampDropX(rawX, activeConfig.radius);
  };

  const dropCurrentSnack = () => {
    if (isGameOverRef.current) {
      return;
    }
    const engine = engineRef.current;
    if (!engine) {
      return;
    }
    const elapsed = simTimeMsRef.current - lastDropTimeRef.current;
    if (elapsed < GAME_CONFIG.dropCooldownMs) {
      return;
    }

    const tier = activeTierRef.current;
    const config = getSnackTier(tier);
    const dropX = clampDropX(aimXRef.current, config.radius);

    const newBody = createSnackBody(
      tier,
      dropX,
      GAME_CONFIG.spawnY,
      simTimeMsRef.current,
    );
    Matter.World.add(engine.world, newBody);

    lastDropTimeRef.current = simTimeMsRef.current;
    canDropRef.current = false;
    soundEngine.unlock();
    soundEngine.playDrop();
    onSnackDroppedRef.current();
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (isGameOverRef.current) {
      return;
    }
    soundEngine.unlock();
    soundEngine.startMusic();
    isPointerDownRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateAimFromEvent(e);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (isGameOverRef.current) {
      return;
    }
    updateAimFromEvent(e);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) {
      return;
    }
    isPointerDownRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    updateAimFromEvent(e);
    dropCurrentSnack();
  };

  const handlePointerCancel = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {isDangerActive && !isGameOver && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-2 z-10 inline-flex items-center gap-1.5 bg-red-50 text-red-800 border border-red-200 rounded-lg px-2.5 py-1 text-xs font-semibold pointer-events-none"
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Hampir penuh</span>
        </div>
      )}

      <div
        className="rounded-2xl overflow-hidden border-4"
        style={{
          borderColor: GAME_CONFIG.containerBorderColor,
          backgroundColor: GAME_CONFIG.canvasBgColor,
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          aria-label="Area permainan Merge Snack Nusantara"
          style={{
            width: displaySize.width,
            height: displaySize.height,
          }}
          className="block touch-none select-none cursor-crosshair"
        />
      </div>
    </div>
  );
}
