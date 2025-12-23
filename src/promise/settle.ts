/**
 * Result of a settled promise - either fulfilled or rejected.
 */
export type SettledResult<T> = { status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown };

/**
 * Wait for all promises to settle (either fulfill or reject).
 * Similar to Promise.allSettled but with cleaner types.
 *
 * @param promises - Array of promises to settle
 * @returns Promise resolving to array of settled results
 */
export async function pSettleFast<T>(promises: readonly Promise<T>[]): Promise<SettledResult<T>[]> {
  return Promise.all(
    promises.map(async p => {
      try {
        return { status: 'fulfilled' as const, value: await p };
      } catch (reason) {
        return { status: 'rejected' as const, reason };
      }
    }),
  );
}
