export interface RetryOptions {
  /**
   * Number of retry attempts after first failure. Defaults to 3.
   */
  retries?: number;

  /**
   * Delay between retries in ms, or function that takes attempt number.
   * Defaults to 0 (no delay).
   */
  delay?: number | ((attempt: number) => number);

  /**
   * Function to determine if error should trigger retry.
   * Defaults to always retry.
   */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

/**
 * Retry an async function with configurable attempts, delay, and conditions.
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Promise resolving to function result
 * @throws Last error if all retries fail
 */
export async function pRetryFast<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { retries = 3, delay = 0, shouldRetry = () => true } = options;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries && shouldRetry(err, attempt)) {
        const wait = typeof delay === 'function' ? delay(attempt) : delay;
        if (wait > 0) {
          await new Promise(r => setTimeout(r, wait));
        }
      } else {
        break;
      }
    }
  }
  throw lastError;
}
