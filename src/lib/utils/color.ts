export function hexToHslTuple(hex: string): [number, number, number] | null {
  const normalized = hex.replace('#', '');
  const valid = normalized.length === 3 || normalized.length === 6;
  if (!valid) return null;

  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  const bigint = Number.parseInt(value, 16);
  if (Number.isNaN(bigint)) return null;

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
      default:
        h = 0;
    }
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return [Math.round(h * 60), Math.round(s * 100), Math.round(l * 100)];
}

export function hexToCssHsl(hex: string, fallback: string) {
  const tuple = hexToHslTuple(hex);
  if (!tuple) return fallback;
  return `${tuple[0]} ${tuple[1]}% ${tuple[2]}%`;
}
