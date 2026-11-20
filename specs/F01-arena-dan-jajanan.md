# F01 Arena Wadah dan 9 Tier Jajanan Prosedural

Sumber PRD: Bagian 2.3, Bagian 3, dan Bagian 5.2

## Tujuan
Pemain dapat melihat wadah permainan berlatar krem hangat dengan bingkai kayu serta sembilan jenis jajanan Nusantara yang digambar langsung pada kanvas tanpa aset gambar eksternal.

## Alur
1. Aplikasi memuat konfigurasi wadah dan daftar 9 tier jajanan dari `src/config.ts`.
2. Kanvas HTML5 berukuran logis 360×520 px dirender di tengah layar dengan skala responsif agar muat pada layar 360×740 px maupun desktop.
3. Setiap jajanan digambar secara prosedural di Canvas 2D sesuai tier (warna utama, gradasi lembut, dan hiasan/tekstur khas).
4. Di bilah atas tampil tombol ikon mulai ulang cepat untuk memulai sesi baru kapan saja.

## Data
- `GAME_CONFIG.containerWidth` (`360`)
- `GAME_CONFIG.containerHeight` (`520`)
- `GAME_CONFIG.canvasBgColor` (`#FFF8E7`)
- `GAME_CONFIG.containerBorderColor` (`#5D4037`)
- `GAME_CONFIG.pageBackgroundImage` (`/assets/aistudio/032573200_1721202304-shutterstock_2305274283_f2bd60b8.jpg`)
- `SNACK_TIERS` (Tier 1 sampai Tier 9: `tier`, `name`, `radius`, `color`, `accentDescription`, `mergePoints`)

## Aturan dan rumus
- Ukuran area wadah logis tetap `360 × 520` piksel dengan rasio aspek `360 / 520`.
- Skala tampilan dihitung dari lebar dan tinggi layar yang tersedia agar kanvas tidak terpotong dan tidak memicu gulir vertikal pada layar `360 × 740`.
- Radius, warna utama, dan ilustrasi khas tiap tier sesuai PRD Bagian 3 agar langsung dikenali sesuai nama makanannya:
  1. Klepon: radius 18, `#2E7D32` — bola ketan hijau pandan berbalut parutan kelapa putih dan hiasan daun pandan.
  2. Onde-Onde: radius 24, `#D4A373` — bola goreng kecokelatan bertabur biji wijen krem merata.
  3. Lemper: radius 31, `#66BB6A` — gulungan daun pisang dengan ikatan tali dan sedikit ketan putih terbuka di atas alas bundar.
  4. Kue Lapis: radius 39, `#EC407A` — potongan kue lapis berundak warna pink dan putih dalam tampilan miring di atas piring kecil bundar.
  5. Martabak Manis: radius 48, `#FBC02D` — loyang martabak bulat berkulit cokelat, terpotong kotak, separuh taburan meses cokelat dan separuh keju parut.
  6. Es Cendol: radius 58, `#8D6E63` — gelas berisi lapisan gula aren cokelat, santan putih, butiran hijau cendol, es batu, dan sedotan bergaris.
  7. Bakso Urat: radius 69, `#757575` — mangkuk bakso putih bergaris merah berisi kuah hangat, bakso urat besar bertekstur belah silang, mie kuning, sawi hijau, dan seledri.
  8. Nasi Goreng: radius 81, `#E65100` — piring putih berisi nasi goreng kecap oranye, telur mata sapi di atasnya, kerupuk, irisan timun, dan tomat.
  9. Tumpeng Mini: radius 94, `#FFD54F` — tampah anyaman bambu beralas daun pisang dengan kerucut nasi kuning puncaknya berhias cabai merah dan lauk keliling.

## Input dan validasi
Tidak ada input formulir pada fitur ini.

## Tampilan dan teks
- Latar kanvas `#FFF8E7` dengan bingkai `#5D4037`.
- Judul aplikasi: "Merge Snack Nusantara".
- Tombol ikon mulai ulang dengan `aria-label="Mulai ulang permainan"` dan area sentuh minimal 44×44 px.

## Kasus uji
| ID | Input | Hasil yang diharapkan | Sumber |
| :--- | :--- | :--- | :--- |
| U01-1 | Daftar `SNACK_TIERS` | Terdapat tepat 9 tier berurutan dari Klepon (radius 18) hingga Tumpeng Mini (radius 94) | PRD Bagian 3 |
| U01-2 | Layar 360×740 px | Wadah permainan tampil utuh tanpa gulir dan tanpa objek terpotong | Tambahan |

## Di luar lingkup
- Memuat file gambar `.png`/`.jpg`/`.webp` atau URL eksternal.

## Pertanyaan terbuka
Kosong (seluruh keputusan sudah dicatat di `DESIGN.md`).
