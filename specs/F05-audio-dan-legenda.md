# F05 Audio Prosedural Web Audio API, Tombol Mute dan Legenda Evolusi

Sumber PRD: Bagian 2.4, Bagian 5.1, dan Bagian 5.3

## Tujuan
Pemain mendengar musik latar ceria bernuansa Nusantara serta umpan balik suara sintetik saat menjatuhkan dan menggabungkan jajanan, dapat membisukan seluruh audio kapan saja, serta melihat urutan evolusi dari Tier 1 hingga Tier 9 di bagian bawah.

## Alur
1. Saat pemain berinteraksi pertama kali, `AudioContext` disiapkan tanpa mengunduh berkas audio eksternal dan musik latar mulai diputar lembut selama permainan aktif.
2. Saat jajanan dijatuhkan, terdengar efek suara *drop* singkat.
3. Saat dua jajanan bergabung, terdengar efek *pop* dengan nada (*pitch*) yang meningkat seiring tingginya tier; penggabungan dua Tumpeng Mini memutar nada bonus singkat.
4. Saat permainan berakhir (`GAME_OVER`), musik latar berhenti otomatis dan terdengar nada *game over* singkat.
5. Menekan tombol ikon suara di bilah atas langsung mengaktifkan atau membisukan musik latar dan semua efek suara.
6. Baris legenda di bagian bawah menampilkan 9 ikon mini jajanan berurutan dari kiri ke kanan (Tier 1 ke Tier 9).

## Data
- `SNACK_TIERS`
- `GAME_CONFIG.audio` (frekuensi dasar *pop*, kenaikan nada per tier, tempo musik latar)

## Aturan dan rumus
- Frekuensi suara *pop* penggabungan: `260 + tier * 55` Hz (naik bertahap dari Tier 1 ke Tier 8).
- Musik latar berupa pola melodi pentatonis berulang (`32` langkah, tempo ~`270 ms` per langkah) yang disintesis langsung lewat `AudioContext` pada volume lembut agar tidak menutupi efek suara.
- Jika `isMuted === true` atau `isGameOver === true`, musik latar tidak berbunyi dan tidak ada oscillator yang dijalankan.
- Setiap tombol ikon di bilah atas memiliki `aria-label` yang jelas dan ukuran sentuh minimal `44 × 44 px`.

## Input dan validasi
Tidak ada input formulir.

## Tampilan dan teks
- Tombol suara pada bilah atas menggunakan ikon `Volume2` / `VolumeX` dari `lucide-react` dengan `aria-label` dinamis ("Bisukan suara" / "Aktifkan suara").
- Baris legenda bawah menampilkan 9 ikon mini dari Klepon hingga Tumpeng Mini beserta informasi nama dan poin saat disentuh/diarahkan (*title*, klik, dan `aria-label`).

## Kasus uji
| ID | Input | Hasil yang diharapkan | Sumber |
| :--- | :--- | :--- | :--- |
| U05-1 | Gabung Tier 1 vs Gabung Tier 6 | Frekuensi suara Tier 6 (`590 Hz`) lebih tinggi daripada Tier 1 (`315 Hz`) | PRD Bagian 4.2 |
| U05-2 | Tombol mute ditekan saat aktif | Status menjadi bisu, ikon berubah ke `VolumeX`, musik dan efek suara berhenti | PRD Bagian 5.1 |
| U05-3 | Baris legenda bawah | Menampilkan tepat 9 ikon berurutan dari Klepon (Tier 1) sampai Tumpeng Mini (Tier 9) | PRD Bagian 5.3 |
| U05-4 | Permainan aktif lalu berakhir (`GAME_OVER`), lalu tekan `Main Lagi` | Musik latar berhenti saat `GAME_OVER` dan berputar lagi saat `Main Lagi` ditekan | Permintaan chat |

## Di luar lingkup
- Berkas audio eksternal `.mp3`/`.wav`.

## Pertanyaan terbuka
Kosong.
