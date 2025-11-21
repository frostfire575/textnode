/**
 * Fallback calculation tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFallbackAdjustments,
  estimateCLSImprovement,
  getRecommendedFallback,
  validateAdjustments,
} from './fallback';
import type { FontMetrics } from '../types';

const mockMetrics: FontMetrics = {
  familyName: 'TestFont',
  ascent: 900,
  descent: -200,
  lineGap: 0,
  unitsPerEm: 1000,
  xHeight: 500,
  capHeight: 700,
};

describe('calculateFallbackAdjustments', () => {
  it('returns all required properties', () => {
    const adjustments = calculateFallbackAdjustments(mockMetrics, 'Arial');
    expect(adjustments).toHaveProperty('ascentOverride');
    expect(adjustments).toHaveProperty('descentOverride');
    expect(adjustments).toHaveProperty('lineGapOverride');
    expect(adjustments).toHaveProperty('sizeAdjust');
  });

  it('returns percentage strings', () => {
    const adjustments = calculateFallbackAdjustments(mockMetrics, 'Arial');
    expect(adjustments.ascentOverride).toMatch(/%$/);
    expect(adjustments.descentOverride).toMatch(/%$/);
    expect(adjustments.lineGapOverride).toMatch(/%$/);
    expect(adjustments.sizeAdjust).toMatch(/%$/);
  });

  it('calculates positive ascent override', () => {
    const adjustments = calculateFallbackAdjustments(mockMetrics, 'Arial');
    const ascentValue = parseFloat(adjustments.ascentOverride);
    expect(ascentValue).toBeGreaterThan(0);
  });

  it('calculates positive descent override', () => {
    const adjustments = calculateFallbackAdjustments(mockMetrics, 'Arial');
    const descentValue = parseFloat(adjustments.descentOverride);
    expect(descentValue).toBeGreaterThan(0);
  });
});

describe('estimateCLSImprovement', () => {
  it('returns before and after values', () => {
    const estimate = estimateCLSImprovement(mockMetrics, 'Arial');
    expect(estimate).toHaveProperty('before');
    expect(estimate).toHaveProperty('after');
  });

  it('after value is less than or equal to before', () => {
    const estimate = estimateCLSImprovement(mockMetrics, 'Arial');
    expect(estimate.after).toBeLessThanOrEqual(estimate.before);
  });

  it('values are within reasonable bounds', () => {
    const estimate = estimateCLSImprovement(mockMetrics, 'Arial');
    expect(estimate.before).toBeGreaterThanOrEqual(0);
    expect(estimate.before).toBeLessThanOrEqual(0.5);
    expect(estimate.after).toBeGreaterThanOrEqual(0);
    expect(estimate.after).toBeLessThanOrEqual(0.1);
  });
});

describe('getRecommendedFallback', () => {
  it('returns Arial for sans-serif', () => {
    expect(getRecommendedFallback('sans-serif')).toBe('Arial');
  });

  it('returns Georgia for serif', () => {
    expect(getRecommendedFallback('serif')).toBe('Georgia');
  });

  it('returns Courier New for monospace', () => {
    expect(getRecommendedFallback('monospace')).toBe('Courier New');
  });

  it('returns Arial for display', () => {
    expect(getRecommendedFallback('display')).toBe('Arial');
  });
});

describe('validateAdjustments', () => {
  it('returns valid for reasonable adjustments', () => {
    const result = validateAdjustments({
      ascentOverride: '90%',
      descentOverride: '20%',
      lineGapOverride: '0%',
      sizeAdjust: '96%',
    });
    expect(result.valid).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  it('warns for extreme ascent override', () => {
    const result = validateAdjustments({
      ascentOverride: '200%',
      descentOverride: '20%',
      lineGapOverride: '0%',
      sizeAdjust: '96%',
    });
    expect(result.valid).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('warns for extreme size adjust', () => {
    const result = validateAdjustments({
      ascentOverride: '90%',
      descentOverride: '20%',
      lineGapOverride: '0%',
      sizeAdjust: '50%',
    });
    expect(result.valid).toBe(false);
    expect(result.warnings.some((w) => w.includes('size-adjust'))).toBe(true);
  });
});
