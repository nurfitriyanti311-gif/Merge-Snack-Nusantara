# F04 Garis Bahaya, Timer 2 Detik, Modal Game Over dan Rekor Lokal

Sumber PRD: Bagian 4.3, Bagian 4.4, Bagian 5.1, dan Bagian 5.4

## Tujuan
Permainan berakhir secara adil saat tumpukan jajanan melewati garis bahaya selama 2 detik penuh, menampilkan hasil akhir, dan menyimpan rekor tertinggi di peramban.

## Alur
1. Garis horizontal merah putus-putus digambar pada ketinggian `90 px` dari tepi atas wadah.
2. Setiap frame, sistem memeriksa semua jajanan yang sudah jatuh lebih dari `1.000 ms`.
3. Jika ada jajanan dengan titik puncak `y - radius < 90`, penghitung waktu bahaya bertambah dan garis bahaya berkedip merah.
4. Jika kondisi bahaya bertahan terus-menerus hingga `2.000 ms`, status permainan berubah menjadi `GAME_OVER`.
5. Jika semua jajanan turun kembali di bawah garis sebelum `2.000 ms`, penghitung waktu bahaya di-reset ke `0`.
6. Saat `GAME_OVER`, modal **"Wadah Penuh!"** muncul menampilkan skor akhir, rekor tertinggi, penanda **"REKOR BARU!"** jika tercapai, dan tombol **"Main Lagi"**.
7. Nilai `highScore` disimpan ke `localStorage` dengan kunci `merge_snack_nusantara_highscore` secara real-time saat `currentScore > highScore`.

## Data
- `GAME_CONFIG.dangerLineY` (`90`)
- `GAME_CONFIG.dangerGraceAfterDropMs` (`1000`)
- `GAME_CONFIG.dangerLimitMs` (`2000`)
- `GAME_CONFIG.highScoreStorageKey` (`merge_snack_nusantara_highscore`)

## Aturan dan rumus
- Syarat jajanan dicek bahaya: `(simTimeMs - snack.droppedAtMs) > 1000`.
- Syarat melewati garis bahaya: `(snack.y - snack.radius) < 90`.
- Akumulasi timer: jika ada minimal satu jajanan memenuhi kedua syarat, `dangerTimerMs += dtMs`; jika tidak ada, `dangerTimerMs = 0`.
- Batas kalah: `dangerTimerMs >= 2000`.
- Penyimpanan lokal: baca angka bulat non-negatif dari `localStorage`, tangani nilai kosong atau rusak dengan fallback `0`.

## Input dan validasi
Tidak ada input formulir. Nilai `localStorage` yang rusak (`NaN`, negatif, atau bukan angka) diabaikan dan dikembalikan sebagai `0`.

## Tampilan dan teks
- Bilah atas: kotak `SKOR` dan `REKOR`.
- Peringatan saat bahaya aktif: garis merah berkedip disertai label teks singkat "Hampir penuh" dengan ikon peringatan.
- Modal Game Over:
  - Judul: `Wadah Penuh!`
  - Skor Akhir & Rekor Tertinggi (format `tabular-nums`)
  - Penanda `REKOR BARU!` (jika `isNewHighScore === true`)
  - Tombol utama: `Main Lagi`

## Kasus uji
| ID | Input | Hasil yang diharapkan | Sumber |
| :--- | :--- | :--- | :--- |
| U04-1 | Jajanan baru dijatuhkan (`umur = 300 ms`) berada di `y = 60, radius = 18` | Timer bahaya tetap `0`, game tidak berakhir | PRD Bagian 4.3 & 6 |
| U04-2 | Jajanan berumur `1500 ms` berada di `y - radius = 85` selama `2000 ms` | Status berubah menjadi `GAME_OVER` | PRD Bagian 4.3 |
| U04-3 | Jajanan melewati garis `1200 ms`, lalu turun ke `y - radius = 110` | Timer bahaya di-reset ke `0` | PRD Bagian 4.3 |
| U04-4 | `currentScore = 350`, `highScore` sebelumnya `200` | `highScore` diperbarui ke `350` di `localStorage` dan modal menampilkan `REKOR BARU!` | PRD Bagian 4.4 & 5.4 |

## Di luar lingkup
- Papan peringkat daring (*leaderboard*).

## Pertanyaan terbuka
Kosong.
