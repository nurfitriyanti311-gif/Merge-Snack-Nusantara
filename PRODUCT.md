# PRODUCT.md — Merge Snack Nusantara

Dokumen ini berisi daftar fitur yang diturunkan dari PRD **Merge Snack Nusantara** v1.1 beserta prioritas, ketergantungan, dan status pengerjaannya.

## Daftar Fitur

| Kode | Nama Fitur | Sumber PRD | Prioritas | Ketergantungan | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| F01 | Arena Wadah & 9 Tier Jajanan Prosedural | Bagian 2.3, 3, 5.2 | P0 | Fondasi (`src/config.ts`) | Selesai |
| F02 | Kontrol Bidik, Penjatuhan & Cooldown | Bagian 4.1 | P0 | F01 | Selesai |
| F03 | Simulasi Fisika, Penggabungan Tier, Skor & Partikel | Bagian 2.2, 4.2 | P0 | F01, F02 | Selesai |
| F04 | Garis Bahaya, Timer 2 Detik, Modal Game Over & Rekor Lokal | Bagian 4.3, 4.4, 5.1, 5.4 | P0 | F03 | Selesai |
| F05 | Audio Prosedural Web Audio API, Tombol Mute & Legenda Evolusi | Bagian 2.4, 5.1, 5.3 | P1 | F01, F03 | Selesai |

## Keputusan Turunan & Klarifikasi PRD

Seluruh aturan utama sudah tercantum jelas di PRD. Keputusan turunan yang ditetapkan untuk kelengkapan teknis:

1. **Kesan Visual & Bahasa UI:** Menggunakan gaya *Ramah dan hangat* dengan font lokal `@fontsource/plus-jakarta-sans`, warna aksen `orange`, dan sapaan `Kamu`.
2. **Visual Jajanan di Canvas:** Seluruh 9 jajanan digambar menggunakan vektor Canvas 2D prosedural (gradien lembut, tekstur, dan hiasan khas tiap jajanan) tanpa emoji sistem maupun URL gambar eksternal agar tampilan konsisten di semua perangkat.
3. **Batas Wadah saat Penggabungan:** Saat dua jajanan bergabung di dekat tepi wadah, posisi hasil penggabungan dijepit (*clamped*) agar tetap berada di dalam batas `[radius, 360 - radius]` sehingga tidak menembus atau terpental keluar dinding.
4. **Masa Tenggang Jajanan Hasil Merge:** Jajanan hasil penggabungan mewarisi waktu jatuh paling baru dari kedua jajanan pembentuknya sehingga tidak langsung memicu *Game Over* seketika jika penggabungan terjadi di dekat garis bahaya.
5. **Tombol Mulai Ulang Cepat:** Selain tombol **Main Lagi** pada modal *Game Over*, disediakan tombol ikon mulai ulang pada bilah atas agar pemain dapat mengulang permainan kapan saja.
