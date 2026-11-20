// Berkas utilitas untuk memformat angka sesuai aturan penulisan angka Indonesia.

const integerFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
});

export function formatSkor(nilai: number): string {
  const aman = Number.isFinite(nilai) ? Math.max(0, Math.round(nilai)) : 0;
  return integerFormatter.format(aman);
}
