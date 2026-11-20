// Komponen modal akhir permainan saat wadah penuh menampilkan skor, rekor tertinggi, dan tombol Main Lagi.

import { Trophy } from 'lucide-react';
import { formatSkor } from '../lib/format';

interface GameOverModalProps {
  isOpen: boolean;
  finalScore: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
}

export function GameOverModal({
  isOpen,
  finalScore,
  highScore,
  isNewHighScore,
  onRestart,
}: GameOverModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/55 px-4"
    >
      <div className="w-full max-w-xs bg-white rounded-2xl p-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]">
        <h2
          id="game-over-title"
          className="text-2xl font-bold text-neutral-900"
        >
          Wadah Penuh!
        </h2>

        {isNewHighScore && (
          <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg text-sm font-semibold">
            <Trophy className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>REKOR BARU!</span>
          </div>
        )}

        <div className="mt-4 bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
          <div>
            <div className="text-sm font-medium text-neutral-600">
              Skor Akhir
            </div>
            <div className="text-3xl font-bold text-neutral-900 tabular-nums mt-0.5">
              {formatSkor(finalScore)}
            </div>
          </div>

          <div className="h-px bg-neutral-200" aria-hidden="true" />

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-neutral-600">Rekor Tertinggi</span>
            <span className="font-bold text-orange-700 tabular-nums">
              {formatSkor(highScore)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          autoFocus
          className="mt-6 w-full min-h-[48px] bg-orange-700 hover:bg-orange-800 text-white text-base font-semibold rounded-xl px-6 py-3 transition-[transform,opacity] duration-150 ease-out active:scale-95 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-orange-700 focus-visible:outline-offset-2"
        >
          Main Lagi
        </button>
      </div>
    </div>
  );
}
