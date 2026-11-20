# F02 Kontrol Bidik, Penjatuhan dan Cooldown

Sumber PRD: Bagian 4.1 dan Bagian 5.2

## Tujuan
Pemain dapat mengarahkan jajanan aktif di atas wadah memakai kursor atau sentuhan jari lalu menjatuhkannya dengan jeda teratur.

## Alur
1. Sistem memilih jajanan aktif dan jajanan berikutnya secara acak dari Tier 1 sampai Tier 4.
2. Jajanan aktif melayang di bagian atas wadah pada koordinat Y tetap sambil menampilkan nama jajanan kecil di dekatnya dan garis vertikal putus-putus ke bawah.
3. Saat pemain menggerakkan kursor atau menggeser jari di area wadah, posisi X jajanan aktif mengikuti pointer dalam batas dinding kiri dan kanan.
4. Saat pemain melepas sentuhan atau klik, jajanan aktif dijatuhkan ke dunia fisika.
5. Sistem menunggu jeda 500 ms sebelum memunculkan jajanan berikutnya di atas.

## Data
- `GAME_CONFIG.containerWidth` (`360`)
- `GAME_CONFIG.spawnY` (`46`)
- `GAME_CONFIG.dropCooldownMs` (`500`)
- `GAME_CONFIG.spawnMaxTier` (`4`)

## Aturan dan rumus
- Pembatasan posisi horizontal: `clampedX = Math.max(radius + 1, Math.min(containerWidth - radius - 1, rawX))` sehingga tepi lingkaran tidak pernah melewati dinding kiri (`x = 0`) maupun dinding kanan (`x = 360`).
- Jajanan yang muncul hanya diacak seragam dari Tier 1, 2, 3, atau 4 (`Math.floor(Math.random() * 4) + 1`).
- Jeda antarjatuhan minimal `500 ms`. Selama jeda berlangsung, input penjatuhan baru diabaikan.

## Input dan validasi
- Input pointer (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) pada kanvas dengan `touch-action: none` agar layar ponsel tidak ikut menggulir saat membidik.
- Koordinat layar dikonversi ke koordinat logis `0..360` berdasarkan rasio ukuran elemen kanvas.

## Tampilan dan teks
- Jajanan aktif di atas wadah, nama jajanan kecil di sebelah/bawahnya, dan garis bidik vertikal putus-putus ke bawah.
- Panel `NEXT` di bilah atas menampilkan pratinjau visual dan nama jajanan berikutnya.

## Kasus uji
| ID | Input | Hasil yang diharapkan | Sumber |
| :--- | :--- | :--- | :--- |
| U02-1 | `rawX = 5`, `radius = 18` | `clampedX = 19` (tidak menembus dinding kiri) | PRD Bagian 4.1 |
| U02-2 | `rawX = 355`, `radius = 39` | `clampedX = 320` (tidak menembus dinding kanan) | PRD Bagian 4.1 |
| U02-3 | Klik dua kali dalam selang 200 ms | Hanya satu jajanan yang jatuh, klik kedua diabaikan sampai 500 ms berlalu | Tambahan |

## Di luar lingkup
- Kontrol papan ketik (*keyboard*).

## Pertanyaan terbuka
Kosong.
