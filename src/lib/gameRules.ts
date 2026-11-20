// Berkas rumus murni permainan: batas posisi, penggabungan tier, skor, dan cek garis bahaya.

import { GAME_CONFIG, getSnackTier } from '../config';

export interface SnackPhysicsSnapshot {
  x: number;
  y: number;
  radius: number;
  droppedAtMs: number;
}

export interface MergeOutcome {
  nextTier: number | null;
  points: number;
  x: number;
  y: number;
  isTumpengBonus: boolean;
}

export function clampDropX(
  rawX: number,
  radius: number,
  containerWidth: number = GAME_CONFIG.containerWidth,
): number {
  const minX = radius + 1;
  const maxX = containerWidth - radius - 1;
  if (minX > maxX) {
    return containerWidth / 2;
  }
  return Math.max(minX, Math.min(maxX, rawX));
}

export function clampBodyPosition(
  rawX: number,
  rawY: number,
  radius: number,
  containerWidth: number = GAME_CONFIG.containerWidth,
  containerHeight: number = GAME_CONFIG.containerHeight,
): { x: number; y: number } {
  const x = clampDropX(rawX, radius, containerWidth);
  const minY = radius + 1;
  const maxY = containerHeight - radius - 1;
  const y = Math.max(minY, Math.min(maxY, rawY));
  return { x, y };
}

export function pilihTierAcak(randomFn: () => number = Math.random): number {
  const tier = Math.floor(randomFn() * GAME_CONFIG.spawnMaxTier) + 1;
  return Math.max(1, Math.min(GAME_CONFIG.spawnMaxTier, tier));
}

export function hitungHasilMerge(
  tier: number,
  posA: { x: number; y: number },
  posB: { x: number; y: number },
): MergeOutcome {
  const xMid = (posA.x + posB.x) / 2;
  const yMid = (posA.y + posB.y) / 2;

  if (tier >= GAME_CONFIG.maxTier) {
    return {
      nextTier: null,
      points: GAME_CONFIG.tumpengBonusPoints,
      x: xMid,
      y: yMid,
      isTumpengBonus: true,
    };
  }

  const nextTier = tier + 1;
  const nextConfig = getSnackTier(nextTier);
  const clamped = clampBodyPosition(xMid, yMid, nextConfig.radius);

  return {
    nextTier,
    points: Math.round(tier * 10),
    x: clamped.x,
    y: clamped.y,
    isTumpengBonus: false,
  };
}

export function cekMelewatiGarisBahaya(
  snacks: readonly SnackPhysicsSnapshot[],
  simTimeMs: number,
  dangerLineY: number = GAME_CONFIG.dangerLineY,
  graceAfterDropMs: number = GAME_CONFIG.dangerGraceAfterDropMs,
): boolean {
  return snacks.some((snack) => {
    const ageMs = simTimeMs - snack.droppedAtMs;
    if (ageMs <= graceAfterDropMs) {
      return false;
    }
    return snack.y - snack.radius < dangerLineY;
  });
}

export function hitungTimerBahaya(
  currentTimerMs: number,
  isCrossingDangerLine: boolean,
  dtMs: number,
  dangerLimitMs: number = GAME_CONFIG.dangerLimitMs,
): { nextTimerMs: number; isGameOver: boolean } {
  if (!isCrossingDangerLine) {
    return { nextTimerMs: 0, isGameOver: false };
  }
  const safeDt = Math.max(0, dtMs);
  const nextTimerMs = currentTimerMs + safeDt;
  return {
    nextTimerMs,
    isGameOver: nextTimerMs >= dangerLimitMs,
  };
}
