import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 200));
    expect(result.current).toBe('initial');
  });

  it('updates only after the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    // Not yet flushed.
    expect(result.current).toBe('a');

    vi.advanceTimersByTime(199);
    expect(result.current).toBe('a');

    vi.advanceTimersByTime(1);
    expect(result.current).toBe('b');
  });
});
