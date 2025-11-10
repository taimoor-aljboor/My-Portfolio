import { describe, expect, it } from 'vitest';
import { hexToHslTuple, hexToCssHsl } from '@/lib/utils/color';

describe('color utilities', () => {
  it('converts hex to HSL tuple', () => {
    expect(hexToHslTuple('#ffffff')).toEqual([0, 0, 100]);
    expect(hexToHslTuple('#000000')).toEqual([0, 0, 0]);
    expect(hexToHslTuple('#0ea5e9')).toEqual([199, 89, 48]);
  });

  it('returns null for invalid values', () => {
    expect(hexToHslTuple('zzz')).toBeNull();
    expect(hexToHslTuple('#12')).toBeNull();
  });

  it('generates CSS-ready HSL strings', () => {
    expect(hexToCssHsl('#0ea5e9', '0 0% 0%')).toBe('199 89% 48%');
    expect(hexToCssHsl('invalid', '221 83% 53%')).toBe('221 83% 53%');
  });
});
