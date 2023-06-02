import type { TimestampObjectOptions } from '../timestampOptions'

export type IsTimestampObjectOptions = (
  timestampOptions: boolean | TimestampObjectOptions
) => timestampOptions is TimestampObjectOptions

export const isTimestampObjectOptions: IsTimestampObjectOptions = (
  timestampOptions: boolean | TimestampObjectOptions
): timestampOptions is TimestampObjectOptions => typeof timestampOptions === 'object'
