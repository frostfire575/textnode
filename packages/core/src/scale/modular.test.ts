/**
 * Modular scale tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateModularStep,
  calculateModularScale,
  calculateModularScaleRange,
  getRatioName,
  NAMED_RATIOS,
} from './modular';

describe('calculateModularStep', () => {
  it('returns base value at step 0', () => {
    expect(calculateModularStep(16, 1.5, 0)).toBe(16);
  });

  it('calculates correct value for positive steps', () => {
    expect(calculateModularStep(16, 2, 1)).toBe(32);
    expect(calculateModularStep(16, 2, 2)).toBe(64);
  });

  it('calculates correct value for negative steps', () => {
    expect(calculateModularStep(16, 2, -1)).toBe(8);
    expect(calculateModularStep(16, 2, -2)).toBe(4);
  });

  it('works with common ratios', () => {
    // Perfect Fifth (1.5)
    expect(calculateModularStep(16, 1.5, 1)).toBe(24);
    // Golden Ratio (1.618)
    expect(calculateModularStep(16, 1.618, 1)).toBeCloseTo(25.888, 2);
  });
});

describe('calculateModularScale', () => {
  it('generates scale with correct keys', () => {
    const scale = calculateModularScale({ type: 'modular', base: 16, ratio: 1.25 });
    expect(scale).toHaveProperty('xs');
    expect(scale).toHaveProperty('sm');
    expect(scale).toHaveProperty('base');
    expect(scale).toHaveProperty('lg');
    expect(scale).toHaveProperty('xl');
    expect(scale).toHaveProperty('2xl');
  });

  it('base value matches configuration', () => {
    const scale = calculateModularScale({ type: 'modular', base: 16, ratio: 1.25 });
    expect(scale.base).toBe(16);
  });

  it('values increase with each step', () => {
    const scale = calculateModularScale({ type: 'modular', base: 16, ratio: 1.25 });
    expect(scale.lg).toBeGreaterThan(scale.base as number);
    expect(scale.xl).toBeGreaterThan(scale.lg as number);
    expect(scale['2xl']).toBeGreaterThan(scale.xl as number);
  });

  it('values decrease for smaller sizes', () => {
    const scale = calculateModularScale({ type: 'modular', base: 16, ratio: 1.25 });
    expect(scale.sm).toBeLessThan(scale.base as number);
    expect(scale.xs).toBeLessThan(scale.sm as number);
  });
});

describe('calculateModularScaleRange', () => {
  it('returns array of correct length', () => {
    const values = calculateModularScaleRange(16, 1.5, 5, 2);
    expect(values).toHaveLength(8); // 2 down + base + 5 up
  });

  it('includes base value', () => {
    const values = calculateModularScaleRange(16, 1.5, 3, 2);
    expect(values).toContain(16);
  });

  it('values are sorted smallest to largest', () => {
    const values = calculateModularScaleRange(16, 1.5, 3, 2);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe('getRatioName', () => {
  it('returns correct name for known ratios', () => {
    expect(getRatioName(1.5)).toBe('perfectFifth');
    expect(getRatioName(1.618)).toBe('goldenRatio');
    expect(getRatioName(1.25)).toBe('majorThird');
  });

  it('returns null for unknown ratios', () => {
    expect(getRatioName(1.234)).toBeNull();
  });
});

describe('NAMED_RATIOS', () => {
  it('contains common ratios', () => {
    expect(NAMED_RATIOS.minorSecond).toBe(1.067);
    expect(NAMED_RATIOS.majorSecond).toBe(1.125);
    expect(NAMED_RATIOS.minorThird).toBe(1.2);
    expect(NAMED_RATIOS.majorThird).toBe(1.25);
    expect(NAMED_RATIOS.perfectFourth).toBe(1.333);
    expect(NAMED_RATIOS.perfectFifth).toBe(1.5);
    expect(NAMED_RATIOS.goldenRatio).toBe(1.618);
  });
});
