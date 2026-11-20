// Berkas pengelolaan penyimpanan skor tertinggi di localStorage secara aman.

import { GAME_CONFIG } from '../config';

export function muatRekorTertinggi(): number {
  try {
    const tersimpan = window.localStorage.getItem(GAME_CONFIG.highScoreStorageKey);
    if (!tersimpan) {
      return 0;
    }
    const angka = Number.parseInt(tersimpan, 10);
    if (!Number.isFinite(angka) || angka < 0) {
      return 0;
    }
    return angka;
  } catch {
    return 0;
  }
}

export function simpanRekorTertinggi(skor: number): number {
  const nilaiAman = Number.isFinite(skor) ? Math.max(0, Math.round(skor)) : 0;
  try {
    window.localStorage.setItem(GAME_CONFIG.highScoreStorageKey, String(nilaiAman));
  } catch {
    // Abaikan jika penyimpanan peramban tidak tersedia atau penuh.
  }
  return nilaiAman;
}
