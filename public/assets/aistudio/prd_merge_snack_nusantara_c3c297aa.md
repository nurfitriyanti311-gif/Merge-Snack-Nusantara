# Product Requirements Document (PRD): Merge Snack Nusantara

**Document Version:** 1.1 (AI-Ready Spec)  
**Target Platform:** Web Browser (HTML5 / React / Single-File Web App)  
**Game Genre:** Casual 2D Physics Drop & Merge Puzzle (*Suika-like*)  
**Status:** Ready for AI Code Generation  

---

## 1. Product Overview & Objective

**Merge Snack Nusantara** adalah game kasual berbasis peramban (*web-based*) di mana pemain menjatuhkan berbagai jajanan khas Indonesia dari bagian atas sebuah wadah kotak. Ketika dua jajanan dengan jenis (Tier) yang sama saling bersentuhan, keduanya akan bergabung (*merge*) dan berevolusi menjadi jajanan dengan tingkat yang lebih tinggi dan ukuran lebih besar, sembari memberikan poin.

**Tujuan Utama:**
* Menciptakan aplikasi game ringan yang **langsung dapat dimainkan tanpa login** dan **tanpa aset gambar/audio eksternal** (menggunakan *HTML5 Canvas procedural rendering* / SVG / Web Audio API agar tidak terjadi *broken image/audio*).
* Responsif untuk layar sentuh ponsel (*mobile-first*) maupun *mouse* desktop.

---

## 2. Technical Architecture & AI Implementation Constraints

Agar aplikasi dapat dibangun dan dijalankan langsung dengan sempurna di lingkungan *web preview* / Google AI Studio:
1. **Single-File / Self-Contained Friendly:** Seluruh logika, tampilan UI, dan simulasi fisika harus berjalan mandiri di sisi klien (*client-side*).
2. **2D Physics Engine:** Gunakan `Matter.js` (via CDN atau package) untuk simulasi gravitasi, pantulan (*restitution*), dan deteksi tabrakan (*collision detection*) antar-lingkaran.
3. **Procedural Visuals (Zero External Image Dependencies):** Jangan gunakan URL gambar eksternal. Render setiap jajanan menggunakan *HTML5 Canvas 2D Context* (warna khas, gradien, tekstur/pola sederhana, dan emoji/ikon vektor di tengah lingkaran) agar aset selalu muncul 100% tanpa gagal muat.
4. **Procedural Sound Effects (Web Audio API):** Gunakan *Web Audio API* (`AudioContext`) untuk menghasilkan efek suara *pop* saat penggabungan, suara *drop* saat jatuh, dan nada *game over* tanpa perlu mengunduh file `.mp3`/`.wav`.

---

## 3. Game Entities: 9 Tiers of Nusantara Snacks

Berikut adalah daftar 9 tingkat evolusi objek dari terkecil hingga terbesar yang harus diimplementasikan:

| Tier | Nama Jajanan | Radius (px) | Warna Utama (Hex) | Aksen Visual (Canvas) | Poin Merge ($N \times 10$) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Klepon** | `18` | `#2E7D32` (Hijau Pandan) | Bintik putih parutan kelapa | `10` |
| **2** | **Onde-Onde** | `24` | `#D4A373` (Cokelat Wijen) | Titik-titik wijen krem | `20` |
| **3** | **Lemper** | `31` | `#66BB6A` (Hijau Daun Pisang) | Garis ikatan hitam di tengah | `30` |
| **4** | **Kue Lapis** | `39` | `#EC407A` (Merah Muda) | Garis berlapis putih & pink | `40` |
| **5** | **Martabak Manis** | `48` | `#FBC02D` (Kuning Keemasan) | Bintik cokelat & keju | `50` |
| **6** | **Es Cendol** | `58` | `#8D6E63` (Cokelat Gula Aren) | Coretan hijau cendol & putih santan | `60` |
| **7** | **Bakso Urat** | `69` | `#757575` (Abu-abu Daging) | Tekstur urat & taburan hijau seledri | `70` |
| **8** | **Nasi Goreng** | `81` | `#E65100` (Oranye Kecap) | Potongan telur kuning & timun hijau | `80` |
| **9** | **Tumpeng Mini** | `94` | `#FFD54F` (Kuning Kunyit) | Puncak kerucut emas & hiasan merah | `200` *(Bonus hilang)* |

---

## 4. Core Game Mechanics & Business Logic

### 4.1. Kontrol & Penjatuhan (*Aim & Drop*)
* **Area Wadah (*Container*):** Lebar `360px` (skala responsif menyesuaikan layar), tinggi `520px`, memiliki dinding kiri, dinding kanan, dan lantai bawah yang solid.
* **Garis Bidik (*Aiming Line*):** Saat pemain menggerakkan kursor atau menggeser jari di area wadah, jajanan aktif bergerak secara horizontal mengikuti posisi $X$ dengan garis vertikal putus-putus ke bawah sebagai panduan jatuh.
* **Pembatasan Posisi (*Clamping*):** Koordinat $X$ jajanan aktif dibatasi antara `Wall_Left + Radius` hingga `Wall_Right - Radius` agar tidak pernah muncul di luar wadah.
* **Cooldown:** Setelah pemain melepas sentuhan/klik untuk menjatuhkan jajanan, sistem memberi jeda **500 ms (0,5 detik)** sebelum jajanan berikutnya muncul di atas.
* **Spawn Pool:** Jajanan yang muncul untuk dijatuhkan pemain hanya diacak dari **Tier 1 sampai Tier 4**.

### 4.2. Mekanika Penggabungan (*Merge Logic*)
* **Deteksi Tabrakan:** Ketika dua objek fisik dengan `tier` yang sama bersentuhan (`collisionStart` / `collisionActive`):
  1. Kedua objek dihapus dari dunia fisika (*Matter.World*).
  2. Hitung titik tengah koordinat $(x_{\text{mid}}, y_{\text{mid}})$ dari kedua objek tersebut.
  3. Jika `tier < 9`, buat satu objek baru dengan `tier + 1` pada koordinat $(x_{\text{mid}}, y_{\text{mid}})$, tambahkan skor `tier * 10`, dan tampilkan efek partikel kecil + suara *pop* dengan *pitch* naik sesuai tingkat tier.
  4. Jika `tier == 9` (dua Tumpeng bertemu), kedua objek menghilang tanpa memunculkan objek baru dan memberikan bonus **+200 poin**.

### 4.3. Kondisi Kalah (*Game Over Logic*)
* **Garis Bahaya (*Danger Line*):** Garis horizontal putus-putus berwarna merah pada ketinggian `90px` dari tepi atas wadah.
* **Aturan Timer:** Sistem mengecek setiap *frame* apakah ada objek (yang sudah dilepas/jatuh lebih dari 1 detik) yang posisi puncaknya ($Y - \text{Radius}$) melewati garis bahaya.
  * Jika **Ya**: Timer bahaya bertambah. Garis bahaya berkedip merah sebagai peringatan visual.
  * Jika bertahan selama **2,0 detik** terus-menerus: Permainan berakhir (`GAME_OVER`).
  * Jika objek turun kembali di bawah garis sebelum 2,0 detik: Timer bahaya di-reset ke `0`.

### 4.4. Penyimpanan Skor (*Local Persistence*)
* Simpan `highScore` di `localStorage` browser dengan key `merge_snack_nusantara_highscore`.
* Perbarui `highScore` secara *real-time* jika `currentScore > highScore`.

---

## 5. User Interface (UI) & Layout Requirements

1. **Header Bar (Atas):**
   * **Kiri:** Kotak `SKOR` saat ini (angka besar, tebal) dan `REKOR` (*High Score*).
   * **Kanan:** Panel pratinjau `NEXT` (menampilkan bentuk & nama jajanan berikutnya) + tombol ikon `Mute/Unmute Audio`.
2. **Main Game Canvas (Tengah):**
   * Latar belakang bernuansa hangat/krem lembut (`#FFF8E7`) dengan wadah transparan berbingkai kayu/cokelat (`#5D4037`).
   * Menampilkan nama jajanan kecil di dekat objek aktif yang sedang diarahkan pemain.
3. **Footer / Legend (Bawah):**
   * Baris ikon mini berurutan dari kiri ke kanan (Tier 1 $\rightarrow$ Tier 9) sebagai panduan urutan evolusi bagi pemain.
4. **Modal Game Over (Overlay):**
   * Muncul saat permainan berakhir, menampilkan: Judul *"Wadah Penuh!"*, Skor Akhir, Rekor Tertinggi (dengan lencana *"REKOR BARU!"* jika tercapai), dan tombol besar **"Main Lagi"** (*Restart*).

---

## 6. Acceptance Criteria (Checklist Pengujian)

* [ ] Game dapat dimainkan langsung menggunakan sentuhan (*touch*) di layar ponsel maupun *mouse* di desktop tanpa tombol keyboard.
* [ ] Dua objek dengan Tier yang sama pasti bergabung menjadi Tier berikutnya dan menambah skor sesuai rumus.
* [ ] Tidak ada objek yang menembus dinding wadah atau terlempar keluar layar saat bergabung di dekat tepi.
* [ ] *Game Over* tidak langsung terpicu saat objek baru saja dijatuhkan melewati garis merah, melainkan menunggu batas toleransi 2 detik.
* [ ] *High Score* tetap tersimpan ketika halaman di-refresh.