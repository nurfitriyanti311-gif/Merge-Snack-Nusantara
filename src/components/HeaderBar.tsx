// Komponen bilah atas berisi skor saat ini, rekor tertinggi, pratinjau jajanan berikutnya, tombol ulang, dan kontrol suara.

import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { getSnackTier } from '../config';
import { formatSkor } from '../lib/format';
import { SnackPreviewIcon } from './SnackPreviewIcon';

interface HeaderBarProps {
  score: number;
  highScore: number;
  nextTier: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
}

export function HeaderBar({
  score,
  highScore,
  nextTier,
  isMuted,
  onToggleMute,
  onRestart,
}: HeaderBarProps) {
  const nextSnack = getSnackTier(nextTier);

  return (
    <header className="w-full bg-white border border-neutral-200 rounded-2xl px-3 py-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-wide text-neutral-600">
            SKOR
          </div>
          <div className="text-xl sm:text-2xl font-bold text-neutral-900 tabular-nums leading-tight">
            {formatSkor(score)}
          </div>
        </div>

        <div className="h-8 w-px bg-neutral-200 shrink-0" aria-hidden="true" />

        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-wide text-neutral-600">
            REKOR
          </div>
          <div className="text-base sm:text-lg font-semibold text-orange-700 tabular-nums leading-tight">
            {formatSkor(highScore)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <div
          className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1"
          aria-label={`Berikutnya: ${nextSnack.name}`}
        >
          <SnackPreviewIcon tier={nextTier} size={28} className="shrink-0" />
          <div className="leading-tight max-w-[78px]">
            <div className="text-[10px] font-semibold text-neutral-600">NEXT</div>
            <div className="text-xs font-semibold text-neutral-900 truncate">
              {nextSnack.name}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          aria-label="Mulai ulang permainan"
          title="Mulai ulang"
          className="w-11 h-11 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 flex items-center justify-center transition-transform duration-150 ease-out active:scale-95 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-orange-700 focus-visible:outline-offset-2 shrink-0"
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Aktifkan suara' : 'Bisukan suara'}
          title={isMuted ? 'Aktifkan suara' : 'Bisukan suara'}
          className="w-11 h-11 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 flex items-center justify-center transition-transform duration-150 ease-out active:scale-95 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-orange-700 focus-visible:outline-offset-2 shrink-0"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-neutral-500" aria-hidden="true" />
          ) : (
            <Volume2 className="w-5 h-5 text-orange-700" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
