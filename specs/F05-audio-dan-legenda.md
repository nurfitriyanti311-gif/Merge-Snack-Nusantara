# F05 Audio Prosedural Web Audio API, Tombol Mute dan Legenda Evolusi

Sumber PRD: Bagian 2.4, Bagian 5.1, dan Bagian 5.3

## Tujuan
Pemain mendengar umpan balik suara sintetik saat menjatuhkan dan menggabungkan jajanan, dapat membisukan audio kapan saja, serta melihat urutan evolusi dari Tier 1 hingga Tier 9 di bagian bawah.

## Alur
1. Saat pemain berinteraksi pertama kali, `AudioContext` disiapkan tanpa mengunduh berkas audio eksternal.
2. Saat jajanan dijatuhkan, terdengar efek suara *drop* singkat.
3. Saat dua jajanan bergabung, terdengar efek *pop* dengan nada (*pitch*) yang meningkat seiring tingginya tier; penggabungan dua Tumpeng Mini memutar nada bonus singkat.
4. Saat permainan berakhir, terdengar nada *game over* singkat.
5. Menekan tombol ikon suara di bilah atas langsung mengaktifkan atau membisukan semua efek suara.
6. Baris legenda di bagian bawah menampilkan 9 ikon mini jajanan berurutan dari kiri ke kanan (Tier 1 ke Tier 9).

## Data
- `SNACK_TIERS`
- `GAME_CONFIG.audio` (frekuensi dasar *pop*, kenaikan nada per tier, durasi efek)

## Aturan dan rumus
- Frekuensi suara *pop* penggabungan: `260 + tier * 55` Hz (naik bertahap dari Tier 1 ke Tier 8).
- Jika `isMuted === true`, tidak ada oscillator yang dibunyikan.
- Setiap tombol ikon di bilah atas memiliki `aria-label` yang jelas dan ukuran sentuh minimal `44 × 44 px`.

## Input dan validasi
Tidak ada input formulir.

## Tampilan dan teks
- Tombol suara pada bilah atas menggunakan ikon `Volume2` / `VolumeX` dari `lucide-react` dengan `aria-label` dinamis ("Bisukan suara" / "Aktifkan suara").
- Baris legenda bawah menampilkan 9 ikon mini dari Klepon hingga Tumpeng Mini beserta label "Urutan Evolusi" dan nama tiap jajanan saat disentuh/diarahkan (*title* & `aria-label`).

## Kasus uji
| ID | Input | Hasil yang diharapkan | Sumber |
| :--- | :--- | :--- | :--- |
| U05-1 | Gabung Tier 1 vs Gabung Tier 6 | Frekuensi suara Tier 6 (`590 Hz`) lebih tinggi daripada Tier 1 (`315 Hz`) | PRD Bagian 4.2 |
| U05-2 | Tombol mute ditekan saat aktif | Status menjadi bisu, ikon berubah ke `VolumeX`, suara tidak keluar | PRD Bagian 5.1 |
| U05-3 | Baris legenda bawah | Menampilkan tepat 9 ikon berurutan dari Klepon (Tier 1) sampai Tumpeng Mini (Tier 9) | PRD Bagian 5.3 |

## Di luar lingkup
- Musik latar (*background music*) berulang terus-menerus atau berkas `.mp3`/`.wav`.

## Pertanyaan terbuka
Kosong.
