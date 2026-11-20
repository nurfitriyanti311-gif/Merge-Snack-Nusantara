// Komponen baris legenda bawah menampilkan urutan evolusi sembilan jajanan dari Tier 1 hingga Tier 9.

import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { getSnackTier, SNACK_TIERS } from '../config';
import { SnackPreviewIcon } from './SnackPreviewIcon';

export function EvolutionLegend() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const selectedSnack = selectedTier !== null ? getSnackTier(selectedTier) : null;

  return (
    <footer
      aria-label="Urutan evolusi jajanan"
      className="w-full bg-[#FFFDF9] border border-[#D7CCC8] rounded-2xl px-2.5 py-2"
    >
      <div className="flex items-center justify-between gap-0.5 overflow-x-auto">
        {SNACK_TIERS.map((snack, index) => {
          const isSelected = selectedTier === snack.tier;
          return (
            <div key={snack.tier} className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() =>
                  setSelectedTier((prev) => (prev === snack.tier ? null : snack.tier))
                }
                title={`${snack.name} (${snack.mergePoints} poin)`}
                aria-label={`Tier ${snack.tier}: ${snack.name}, ${snack.mergePoints} poin`}
                aria-pressed={isSelected}
                className={`p-0.5 rounded-lg transition-[transform,opacity] duration-150 ease-out active:scale-95 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-orange-700 focus-visible:outline-offset-1 ${
                  isSelected ? 'bg-orange-50 ring-1 ring-orange-700' : 'hover:bg-neutral-100'
                }`}
              >
                <SnackPreviewIcon tier={snack.tier} size={24} />
              </button>
              {index < SNACK_TIERS.length - 1 && (
                <ChevronRight
                  className="w-3 h-3 text-neutral-400 shrink-0"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {selectedSnack && (
        <div className="mt-1.5 pt-1.5 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-700">
          <span className="font-semibold text-neutral-900">
            Tier {selectedSnack.tier}: {selectedSnack.name}
          </span>
          <span className="font-medium text-orange-700 tabular-nums">
            +{selectedSnack.mergePoints} poin
          </span>
        </div>
      )}
    </footer>
  );
}
