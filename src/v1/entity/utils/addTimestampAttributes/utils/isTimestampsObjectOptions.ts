import type { TimestampsObjectOptions, TimestampsOptions } from '../timestampOptions'

export type IsTimestampsObjectOptions = (
  timestampsOptions: TimestampsOptions
) => timestampsOptions is TimestampsObjectOptions

export const isTimestampsObjectOptions: IsTimestampsObjectOptions = (
  timestampsOptions: TimestampsOptions
): timestampsOptions is TimestampsObjectOptions => typeof timestampsOptions === 'object'
