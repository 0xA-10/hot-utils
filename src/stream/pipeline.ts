import type { PipelineDestination, PipelineSource, PipelineTransform } from 'node:stream';
import { pipeline as nodePipeline } from 'node:stream/promises';

/**
 * Type-safe wrapper for stream pipeline.
 * Uses the native stream/promises pipeline under the hood.
 *
 * @param source - Readable stream or async iterable
 * @param transforms - Transform streams and final writable
 * @returns Promise that resolves when pipeline completes
 */
export async function pipelineFast<A extends PipelineSource<unknown>, B extends PipelineDestination<A, unknown>>(
  source: A,
  destination: B,
): Promise<void>;
export async function pipelineFast<
  A extends PipelineSource<unknown>,
  T1 extends PipelineTransform<A, unknown>,
  B extends PipelineDestination<T1, unknown>,
>(source: A, transform1: T1, destination: B): Promise<void>;
export async function pipelineFast<
  A extends PipelineSource<unknown>,
  T1 extends PipelineTransform<A, unknown>,
  T2 extends PipelineTransform<T1, unknown>,
  B extends PipelineDestination<T2, unknown>,
>(source: A, transform1: T1, transform2: T2, destination: B): Promise<void>;
export async function pipelineFast<
  A extends PipelineSource<unknown>,
  T1 extends PipelineTransform<A, unknown>,
  T2 extends PipelineTransform<T1, unknown>,
  T3 extends PipelineTransform<T2, unknown>,
  B extends PipelineDestination<T3, unknown>,
>(source: A, transform1: T1, transform2: T2, transform3: T3, destination: B): Promise<void>;
export async function pipelineFast(...streams: unknown[]): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return nodePipeline(...(streams as [any, ...any[]]));
}
