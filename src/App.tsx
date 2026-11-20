// Komponen utama aplikasi Merge Snack Nusantara yang mengatur alur permainan, skor, rekor, dan suara.

import { useCallback, useEffect, useState } from 'react';
import { EvolutionLegend } from './components/EvolutionLegend';
import { GameCanvas } from './components/GameCanvas';
import { GameOverModal } from './components/GameOverModal';
import { HeaderBar } from './components/HeaderBar';
import { GAME_CONFIG } from './config';
import { pilihTierAcak } from './lib/gameRules';
import { soundEngine } from './lib/sound';
import { muatRekorTertinggi, simpanRekorTertinggi } from './lib/storage';

export default function App() {
  const [sessionId, setSessionId] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => muatRekorTertinggi());
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [activeTier, setActiveTier] = useState<number>(() => pilihTierAcak());
  const [nextTier, setNextTier] = useState<number>(() => pilihTierAcak());
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [bgError, setBgError] = useState(false);

  const handleSnackDropped = useCallback(() => {
    setActiveTier(nextTier);
    setNextTier(pilihTierAcak());
  }, [nextTier]);

  const handleAddScore = useCallback((points: number) => {
    setScore((prevScore) => {
      const nextScore = prevScore + points;
      setHighScore((prevHigh) => {
        if (nextScore > prevHigh) {
          simpanRekorTertinggi(nextScore);
          setIsNewHighScore(true);
          return nextScore;
        }
        return prevHigh;
      });
      return nextScore;
    });
  }, []);

  useEffect(() => {
    return () => {
      soundEngine.stopMusic();
    };
  }, []);

  const handleGameOver = useCallback(() => {
    soundEngine.stopMusic();
    setIsGameOver(true);
  }, []);

  const handleRestart = useCallback(() => {
    soundEngine.unlock();
    soundEngine.startMusic();
    setScore(0);
    setIsNewHighScore(false);
    setIsGameOver(false);
    setActiveTier(pilihTierAcak());
    setNextTier(pilihTierAcak());
    setSessionId((prev) => prev + 1);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      if (!next) {
        soundEngine.unlock();
        if (!isGameOver) {
          soundEngine.startMusic();
        }
      }
      return next;
    });
  }, [isGameOver]);

  return (
    <main className="relative min-h-[100dvh] w-full bg-[#3E2723] flex flex-col items-center justify-center px-3 py-2 sm:py-4 overflow-hidden">
      {!bgError && (
        <img
          src={GAME_CONFIG.pageBackgroundImage}
          alt="Latar tampah jajanan pasar Nusantara di atas meja bambu"
          onError={() => setBgError(true)}
          className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />
      )}
      <div
        className="fixed inset-0 bg-[#2C1A12]/45 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[384px] flex flex-col items-center gap-2 sm:gap-3">
        <h1 className="bg-[#3E2723] text-[#FFF8E7] border border-[#8D6E63]/60 rounded-xl px-4 py-1 text-base sm:text-lg font-bold tracking-tight text-center shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]">
          Merge Snack Nusantara
        </h1>

        <HeaderBar
          score={score}
          highScore={highScore}
          nextTier={nextTier}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onRestart={handleRestart}
        />

        <GameCanvas
          sessionId={sessionId}
          activeTier={activeTier}
          isGameOver={isGameOver}
          onSnackDropped={handleSnackDropped}
          onAddScore={handleAddScore}
          onGameOver={handleGameOver}
        />

        <EvolutionLegend />
      </div>

      <GameOverModal
        isOpen={isGameOver}
        finalScore={score}
        highScore={highScore}
        isNewHighScore={isNewHighScore}
        onRestart={handleRestart}
      />
    </main>
  );
}
