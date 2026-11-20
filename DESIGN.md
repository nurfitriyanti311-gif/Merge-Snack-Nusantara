# DESIGN.md — Merge Snack Nusantara

Dokumen ini mencatat keputusan desain antarmuka dan token visual sesuai pedoman proyek.

## Keputusan Desain

| Keputusan | Pilihan Dipakai | Alasan |
| :--- | :--- | :--- |
| Nama Aplikasi | Merge Snack Nusantara | Sesuai judul PRD |
| Pengguna Utama | Pemain game kasual web & mobile | Sesuai tujuan utama PRD (mobile-first & desktop) |
| Kesan Visual | Ramah dan hangat (`Plus Jakarta Sans`) | Sesuai tema jajanan pasar Indonesia yang akrab dan kasual |
| Warna Aksen | Oranye (`orange-700` / `orange-800`) | Hangat, kontras tinggi (≥ 4,5:1 dengan teks putih), cocok dengan tema kuliner |
| Sapaan Pengguna | Kamu | Terasa santai dan akrab untuk game kasual |
| Susunan Halaman | Satu layar utama terpusat tanpa gulir | Seluruh kontrol, wadah game, dan legenda evolusi muat di layar 360×740 px |
| Posisi Aksi Utama | Area permainan interaktif di tengah + tombol "Main Lagi" di modal | Interaksi langsung di kanvas tanpa langkah bertahap |
| Gambar / Aset | Canvas 2D prosedural tanpa URL gambar eksternal | Sesuai larangan aset eksternal di PRD |

## Token Visual & Warna

- **Latar halaman:** `bg-neutral-50`
- **Panel & modal:** `bg-white` dengan sudut `rounded-2xl`
- **Kanvas arena:** `#FFF8E7` (krem hangat) dengan bingkai kayu `#5D4037` (sesuai PRD Bagian 5.2)
- **Teks utama:** `text-neutral-900`
- **Teks pendukung:** `text-neutral-600`
- **Tombol utama:** `bg-orange-700 hover:bg-orange-800 text-white rounded-xl`
- **Cincin fokus:** `focus-visible:outline-2 focus-visible:outline-orange-700 focus-visible:outline-offset-2`
- **Status berhasil (Rekor Baru):** `bg-emerald-50 text-emerald-800` dengan ikon piala
- **Status peringatan (Garis Bahaya):** `bg-red-50 text-red-800` dengan ikon peringatan
- **Tipografi:** `@fontsource/plus-jakarta-sans` (ketebalan 400, 500, 600, 700), angka memakai `tabular-nums`
- **Gerak:** Hanya `transform` dan `opacity`, durasi 150–200 ms, menghormati `motion-reduce:`
