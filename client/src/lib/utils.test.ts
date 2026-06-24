import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate, sleep } from './utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });

  it('resolves conflicting Tailwind utilities (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(19.99)).toBe('$19.99');
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('honors a custom currency', () => {
    expect(formatCurrency(10, 'EUR')).toBe('€10.00');
  });
});

describe('formatDate', () => {
  it('formats a date as a medium, locale-aware string', () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe('Jan 15, 2024');
  });
});

describe('sleep', () => {
  it('resolves after the given delay', async () => {
    await expect(sleep(1)).resolves.toBeUndefined();
  });
});
