export type PrUnit = 'lbs' | 'time';
export type PrDirection = 'desc' | 'asc';

export interface PrMovement {
  key: string;
  label: string;
  unit: PrUnit;
  dir: PrDirection;
}

const crossfitMovements: PrMovement[] = [
  { key: 'backsquat', label: 'Back Squat', unit: 'lbs', dir: 'desc' },
  { key: 'benchpress', label: 'Bench Press', unit: 'lbs', dir: 'desc' },
  { key: 'deadlift', label: 'Deadlift', unit: 'lbs', dir: 'desc' },
  { key: 'frontsquat', label: 'Front Squat', unit: 'lbs', dir: 'desc' },
  { key: 'overheadsquat', label: 'Overhead Squat', unit: 'lbs', dir: 'desc' },
  { key: 'pushpress', label: 'Push Press', unit: 'lbs', dir: 'desc' },
  { key: 'shoulderpress', label: 'Shoulder Press', unit: 'lbs', dir: 'desc' },
  { key: 'thruster', label: 'Thruster', unit: 'lbs', dir: 'desc' },
  { key: 'clean', label: 'Clean', unit: 'lbs', dir: 'desc' },
  { key: 'cleanjerk', label: 'Clean & Jerk', unit: 'lbs', dir: 'desc' },
  { key: 'cluster', label: 'Cluster', unit: 'lbs', dir: 'desc' },
  { key: 'hangpowerclean', label: 'Hang Power Clean', unit: 'lbs', dir: 'desc' },
  { key: 'hangpowersnatch', label: 'Hang Power Snatch', unit: 'lbs', dir: 'desc' },
  { key: 'handsquatsnatch', label: 'Hang Squat Snatch', unit: 'lbs', dir: 'desc' },
  { key: 'hangsquatclean', label: 'Hang Squat Clean', unit: 'lbs', dir: 'desc' },
  { key: 'powerclean', label: 'Power Clean', unit: 'lbs', dir: 'desc' },
  { key: 'powersnatch', label: 'Power Snatch', unit: 'lbs', dir: 'desc' },
  { key: 'pushjerk', label: 'Push Jerk', unit: 'lbs', dir: 'desc' },
  { key: 'snatch', label: 'Snatch', unit: 'lbs', dir: 'desc' },
  { key: 'snatchbalance', label: 'Snatch Balance', unit: 'lbs', dir: 'desc' },
  { key: 'splitjerk', label: 'Split Jerk', unit: 'lbs', dir: 'desc' },
  { key: 'squatclean', label: 'Squat Clean', unit: 'lbs', dir: 'desc' },
  { key: 'squatsnatch', label: 'Squat Snatch', unit: 'lbs', dir: 'desc' },
];

/**
 * Para natação reutilizamos as colunas existentes na tabela benchmark
 * (backsquat, benchpress, etc.) apenas com labels de provas de natação.
 * O valor é armazenado em segundos (decimal); mostramos como mm:ss.cc.
 */
const swimmingMovements: PrMovement[] = [
  { key: 'backsquat', label: '50m Livre', unit: 'time', dir: 'asc' },
  { key: 'benchpress', label: '100m Livre', unit: 'time', dir: 'asc' },
  { key: 'deadlift', label: '200m Livre', unit: 'time', dir: 'asc' },
  { key: 'frontsquat', label: '400m Livre', unit: 'time', dir: 'asc' },
  { key: 'overheadsquat', label: '800m Livre', unit: 'time', dir: 'asc' },
  { key: 'pushpress', label: '1500m Livre', unit: 'time', dir: 'asc' },
  { key: 'shoulderpress', label: '50m Costas', unit: 'time', dir: 'asc' },
  { key: 'thruster', label: '100m Costas', unit: 'time', dir: 'asc' },
  { key: 'clean', label: '200m Costas', unit: 'time', dir: 'asc' },
  { key: 'cleanjerk', label: '50m Peito', unit: 'time', dir: 'asc' },
  { key: 'cluster', label: '100m Peito', unit: 'time', dir: 'asc' },
  { key: 'hangpowerclean', label: '200m Peito', unit: 'time', dir: 'asc' },
  { key: 'hangpowersnatch', label: '50m Borboleta', unit: 'time', dir: 'asc' },
  { key: 'handsquatsnatch', label: '100m Borboleta', unit: 'time', dir: 'asc' },
  { key: 'hangsquatclean', label: '200m Borboleta', unit: 'time', dir: 'asc' },
  { key: 'powerclean', label: '100m Medley', unit: 'time', dir: 'asc' },
  { key: 'powersnatch', label: '200m Medley', unit: 'time', dir: 'asc' },
  { key: 'pushjerk', label: '400m Medley', unit: 'time', dir: 'asc' },
];

const normalize = (value?: string) =>
  (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

export function getPrMovements(enterpriseArea?: string): PrMovement[] {
  const area = normalize(enterpriseArea);
  if (area.includes('nata')) return swimmingMovements;
  return crossfitMovements;
}

export function getMovementByKey(
  key: string,
  enterpriseArea?: string,
): PrMovement | undefined {
  return getPrMovements(enterpriseArea).find((m) => m.key === key);
}

/**
 * Formata valor pra exibição no ranking.
 * - lbs: `123 lbs`
 * - time (centésimos de segundo armazenados como integer): `mm:ss.cc`
 */
export function formatPrValue(value: number | string | undefined, unit: PrUnit) {
  const num = Number(value || 0);
  if (!num) return '—';

  if (unit === 'lbs') {
    return `${Math.round(num).toLocaleString('pt-BR')} lbs`;
  }

  // time armazenado em centésimos → mm:ss.cc
  const totalCs = Math.max(0, Math.round(num));
  const minutes = Math.floor(totalCs / 6000);
  const seconds = Math.floor((totalCs % 6000) / 100);
  const cs = totalCs % 100;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const cc = String(cs).padStart(2, '0');
  return `${mm}:${ss}.${cc}`;
}

/**
 * Converte input mm:ss.cc para centésimos de segundo (integer).
 * Aceita "01:23.45", "01:23", "83.45", "83" etc.
 */
export function parseTimeInput(raw: string | undefined): number {
  if (raw === undefined || raw === null) return 0;
  const text = String(raw).trim();
  if (!text) return 0;

  const clean = text.replace(/_/g, '');
  const match = clean.match(/^(\d{1,3}):(\d{1,2})(?:\.(\d{1,2}))?$/);
  if (match) {
    const minutes = Number(match[1]) || 0;
    const seconds = Number(match[2]) || 0;
    const csRaw = match[3] || '';
    const cs = csRaw ? Number(csRaw.padEnd(2, '0').slice(0, 2)) : 0;
    return minutes * 6000 + seconds * 100 + cs;
  }

  const asNumber = Number(clean.replace(',', '.'));
  if (!Number.isFinite(asNumber) || asNumber <= 0) return 0;
  // valor solto em segundos (decimal) → centésimos
  return Math.round(asNumber * 100);
}

/**
 * Converte centésimos armazenados para string mm:ss.cc adequada
 * pra popular o NumberFormat com format="##:##.##" (dígitos crus).
 */
export function centisecondsToInputDigits(value: number | undefined): string {
  const num = Number(value || 0);
  if (!num) return '';
  const totalCs = Math.max(0, Math.round(num));
  const minutes = Math.floor(totalCs / 6000);
  const seconds = Math.floor((totalCs % 6000) / 100);
  const cs = totalCs % 100;
  return `${String(minutes).padStart(2, '0')}${String(seconds).padStart(
    2,
    '0',
  )}${String(cs).padStart(2, '0')}`;
}

/**
 * Ordena o array de rank pelo valor da coluna, respeitando dir do movimento.
 * Ignora entradas com valor 0/nulo (não bateram PR).
 */
export function sortRankByMovement<T extends { [key: string]: any }>(
  ranks: T[],
  key: string,
  dir: PrDirection,
): T[] {
  return [...ranks]
    .filter((r) => Number(r?.[key]) > 0)
    .sort((a, b) => {
      const av = Number(a?.[key]) || 0;
      const bv = Number(b?.[key]) || 0;
      return dir === 'asc' ? av - bv : bv - av;
    });
}
