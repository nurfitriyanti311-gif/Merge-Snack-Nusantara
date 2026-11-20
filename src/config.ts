// Berkas konfigurasi utama berisi seluruh data bisnis dari PRD dan pilihan desain aplikasi.

export interface SnackTierConfig {
  tier: number;
  name: string;
  radius: number;
  color: string;
  accentColor: string;
  accentDescription: string;
  mergePoints: number;
}

export const SNACK_TIERS: readonly SnackTierConfig[] = [
  {
    tier: 1,
    name: 'Klepon',
    radius: 18,
    color: '#2E7D32',
    accentColor: '#FFFFFF',
    accentDescription: 'Bola ketan pandan berbalut parutan kelapa putih',
    mergePoints: 10,
  },
  {
    tier: 2,
    name: 'Onde-Onde',
    radius: 24,
    color: '#D4A373',
    accentColor: '#FFF3E0',
    accentDescription: 'Bola goreng keemasan bertabur biji wijen krem',
    mergePoints: 20,
  },
  {
    tier: 3,
    name: 'Lemper',
    radius: 31,
    color: '#66BB6A',
    accentColor: '#263238',
    accentDescription: 'Gulungan daun pisang bertali dengan isi ketan putih',
    mergePoints: 30,
  },
  {
    tier: 4,
    name: 'Kue Lapis',
    radius: 39,
    color: '#EC407A',
    accentColor: '#FFFFFF',
    accentDescription: 'Potongan kue lapis berlapis pink dan putih',
    mergePoints: 40,
  },
  {
    tier: 5,
    name: 'Martabak Manis',
    radius: 48,
    color: '#FBC02D',
    accentColor: '#5D4037',
    accentDescription: 'Loyang martabak isi meses cokelat dan keju parut',
    mergePoints: 50,
  },
  {
    tier: 6,
    name: 'Es Cendol',
    radius: 58,
    color: '#8D6E63',
    accentColor: '#43A047',
    accentDescription: 'Gelas es cendol dengan gula aren, santan, es, dan sedotan',
    mergePoints: 60,
  },
  {
    tier: 7,
    name: 'Bakso Urat',
    radius: 69,
    color: '#757575',
    accentColor: '#4CAF50',
    accentDescription: 'Mangkuk kuah bakso urat, mie kuning, sawi, dan seledri',
    mergePoints: 70,
  },
  {
    tier: 8,
    name: 'Nasi Goreng',
    radius: 81,
    color: '#E65100',
    accentColor: '#FDD835',
    accentDescription: 'Piring nasi goreng dengan telur ceplok, kerupuk, timun, dan tomat',
    mergePoints: 80,
  },
  {
    tier: 9,
    name: 'Tumpeng Mini',
    radius: 94,
    color: '#FFD54F',
    accentColor: '#D32F2F',
    accentDescription: 'Tampah daun pisang dengan kerucut nasi kuning dan lauk keliling',
    mergePoints: 200,
  },
] as const;

export const GAME_CONFIG = {
  appName: 'Merge Snack Nusantara',
  containerWidth: 360,
  containerHeight: 520,
  wallThickness: 60,
  spawnY: 44,
  dangerLineY: 90,
  dangerGraceAfterDropMs: 1000,
  dangerLimitMs: 2000,
  dropCooldownMs: 500,
  spawnMaxTier: 4,
  maxTier: 9,
  tumpengBonusPoints: 200,
  highScoreStorageKey: 'merge_snack_nusantara_highscore',
  canvasBgColor: '#FFF8E7',
  containerBorderColor: '#5D4037',
  dangerLineColor: '#DC2626',
  physics: {
    gravityY: 1.35,
    restitution: 0.22,
    friction: 0.45,
    frictionStatic: 0.6,
    frictionAir: 0.008,
    density: 0.002,
  },
  audio: {
    mergeBaseHz: 260,
    mergeStepHz: 55,
  },
} as const;

export function getSnackTier(tier: number): SnackTierConfig {
  const found = SNACK_TIERS.find((item) => item.tier === tier);
  return found ?? SNACK_TIERS[0];
}
