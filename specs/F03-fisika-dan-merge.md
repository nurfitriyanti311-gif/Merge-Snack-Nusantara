# F03 Simulasi Fisika, Penggabungan Tier, Skor dan Partikel

Sumber PRD: Bagian 2.2, Bagian 3, dan Bagian 4.2

## Tujuan
Pemain melihat jajanan jatuh, berguling, dan memantul secara realistis serta bergabung menjadi jajanan tingkat lebih tinggi sambil menambah skor saat dua jajanan sejenis bersentuhan.

## Alur
1. Jajanan yang dijatuhkan menjadi badan lingkaran fisika `Matter.js` di dalam wadah berdinding solid kiri, kanan, dan lantai.
2. Ketika dua badan dengan `tier` yang sama bersentuhan (`collisionStart` atau `collisionActive`), keduanya ditandai agar tidak diproses ganda pada frame yang sama.
3. Kedua badan dihapus dari dunia fisika dan dihitung titik tengahnya `(xMid, yMid)`.
4. Jika `tier < 9`, sistem membuat badan baru ber-tier `tier + 1` di titik tengah yang dijepit ke dalam batas wadah, menambahkan skor `tier * 10`, serta memunculkan partikel dan teks poin melayang.
5. Jika `tier === 9` (dua Tumpeng Mini), kedua badan menghilang tanpa memunculkan badan baru, menambahkan bonus `200` poin, dan memunculkan ledakan partikel emas.

## Data
- `SNACK_TIERS`
- `GAME_CONFIG.physics` (`gravityY`, `restitution`, `friction`, `frictionAir`, `density`)
- `GAME_CONFIG.tumpengBonusPoints` (`200`)

## Aturan dan rumus
- Titik tengah: `xMid = (a.x + b.x) / 2`, `yMid = (a.y + b.y) / 2`.
- Penjepitan batas hasil penggabungan untuk radius baru `R`:
  - `xClamped = Math.max(R + 1, Math.min(360 - R - 1, xMid))`
  - `yClamped = Math.min(520 - R - 1, Math.max(R + 1, yMid))`
- Rumus poin saat `tier` (1..8) bergabung: `points = tier * 10`.
- Rumus poin saat `tier === 9` bergabung: `points = 200`.
- Semua nilai uang/skor disimpan sebagai bilangan bulat.

## Input dan validasi
Tidak ada input formulir. Pemeriksaan integritas fisika memastikan badan tidak pernah keluar dari batas `0..360` pada sumbu X dan `<= 520` pada sumbu Y.

## Tampilan dan teks
- Kotak `SKOR` pada bilah atas diperbarui seketika dengan format ribuan Indonesia (contoh: `1.250`).
- Partikel warna jajanan dan angka skor melayang (`+10`, `+200`) tampil singkat di titik penggabungan.

## Kasus uji
| ID | Input | Hasil yang diharapkan | Sumber |
| :--- | :--- | :--- | :--- |
| U03-1 | Dua Klepon (Tier 1) bertemu di `(100, 300)` | Menghasilkan 1 Onde-Onde (Tier 2) dan menambah `10` poin | PRD Bagian 4.2 |
| U03-2 | Dua Tumpeng Mini (Tier 9) bertemu | Keduanya hilang tanpa objek baru dan menambah `200` poin | PRD Bagian 4.2 |
| U03-3 | Dua Nasi Goreng (Tier 8) bertemu di tepi kiri `x = 20` | Tumpeng Mini (radius 94) muncul di `x = 95`, tidak menembus dinding kiri | Tambahan |

## Di luar lingkup
- Kekuatan tambahan (*power-up*) seperti kocok wadah atau bom.

## Pertanyaan terbuka
Kosong.
