// Komponen utama aplikasi Merge Snack Nusantara yang mengatur alur permainan, skor, rekor, dan suara.

import { useCallback, useState } from 'react';
import { EvolutionLegend } from './components/EvolutionLegend';
import { GameCanvas } from './components/GameCanvas';
import { GameOverModal } from './components/GameOverModal';
import { HeaderBar } from './components/HeaderBar';
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

  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
  }, []);

  const handleRestart = useCallback(() => {
    soundEngine.unlock();
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
      }
      return next;
    });
  }, []);

  return (
    <main className="min-h-[100dvh] w-full bg-neutral-50 flex flex-col items-center justify-center px-3 py-2 sm:py-4">
      <div className="w-full max-w-[384px] flex flex-col items-center gap-2 sm:gap-3">
        <h1 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight text-center">
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
