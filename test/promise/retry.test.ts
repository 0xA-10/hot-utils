import { describe, expect, it, vi } from 'vitest';
import { pRetryFast } from '../../src/promise/retry.js';

describe('pRetryFast', () => {
  it('returns result on first success', async () => {
    const result = await pRetryFast(async () => 'success');
    expect(result).toBe('success');
  });

  it('retries on failure', async () => {
    let attempts = 0;
    const result = await pRetryFast(async () => {
      attempts++;
      if (attempts < 3) throw new Error('fail');
      return 'success';
    });
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('throws after max retries', async () => {
    let attempts = 0;
    await expect(
      pRetryFast(
        async () => {
          attempts++;
          throw new Error('always fail');
        },
        { retries: 2 },
      ),
    ).rejects.toThrow('always fail');
    expect(attempts).toBe(3); // initial + 2 retries
  });

  it('respects delay option', async () => {
    const start = Date.now();
    let attempts = 0;
    await pRetryFast(
      async () => {
        attempts++;
        if (attempts < 2) throw new Error('fail');
        return 'success';
      },
      { delay: 50 },
    );
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40); // Allow some timing variance
  });

  it('respects delay function', async () => {
    const delays: number[] = [];
    const delayFn = vi.fn((attempt: number) => {
      delays.push(attempt);
      return 0;
    });

    let attempts = 0;
    await pRetryFast(
      async () => {
        attempts++;
        if (attempts < 3) throw new Error('fail');
        return 'success';
      },
      { delay: delayFn },
    );

    expect(delays).toEqual([0, 1]);
  });

  it('respects shouldRetry option', async () => {
    let attempts = 0;
    await expect(
      pRetryFast(
        async () => {
          attempts++;
          throw new Error('fail');
        },
        {
          retries: 5,
          shouldRetry: (_, attempt) => attempt < 1,
        },
      ),
    ).rejects.toThrow('fail');
    expect(attempts).toBe(2); // initial + 1 retry
  });
});
