import { Transform, type TransformCallback, type TransformOptions } from 'node:stream';

/**
 * Transform function signature for stream transformation.
 */
export type TransformFn<TIn, TOut> = (chunk: TIn, encoding: BufferEncoding) => TOut | Promise<TOut> | null;

/**
 * Create a Transform stream with a simple function.
 * Defaults to object mode.
 *
 * @param transformFn - Function to transform each chunk
 * @param options - Transform stream options (excluding transform function)
 * @returns Transform stream
 */
export function createTransformFast<TIn = unknown, TOut = TIn>(
  transformFn: TransformFn<TIn, TOut>,
  options?: Omit<TransformOptions, 'transform'>,
): Transform {
  return new Transform({
    objectMode: true,
    ...options,
    async transform(chunk: TIn, encoding: BufferEncoding, callback: TransformCallback) {
      try {
        const result = await transformFn(chunk, encoding);
        callback(null, result);
      } catch (err) {
        callback(err as Error);
      }
    },
  });
}

/**
 * Create a filter Transform stream.
 * Chunks that fail the predicate are dropped.
 *
 * @param predicate - Function that returns true to keep chunk
 * @returns Transform stream that filters chunks
 */
export function createFilterStreamFast<T>(predicate: (chunk: T) => boolean | Promise<boolean>): Transform {
  return new Transform({
    objectMode: true,
    async transform(chunk: T, _encoding, callback) {
      try {
        if (await predicate(chunk)) {
          callback(null, chunk);
        } else {
          callback();
        }
      } catch (err) {
        callback(err as Error);
      }
    },
  });
}

/**
 * Create a map Transform stream.
 *
 * @param mapper - Function to map each chunk
 * @returns Transform stream that maps chunks
 */
export function createMapStreamFast<TIn, TOut>(mapper: (chunk: TIn) => TOut | Promise<TOut>): Transform {
  return new Transform({
    objectMode: true,
    async transform(chunk: TIn, _encoding, callback) {
      try {
        callback(null, await mapper(chunk));
      } catch (err) {
        callback(err as Error);
      }
    },
  });
}
