import type { TimestampsOptions } from '../timestampOptions'

import { isTimestampsObjectOptions } from './isTimestampsObjectOptions'

export type IsTimestampEnabled<
  TIMESTAMP_OPTIONS extends TimestampsOptions,
  TIMESTAMP extends 'created' | 'modified'
> = TIMESTAMP_OPTIONS extends true | { [KEY in TIMESTAMP]: true | Record<string, unknown> }
  ? true
  : false

export const isTimestampEnabled = <
  TIMESTAMP_OPTIONS extends TimestampsOptions,
  TIMESTAMP_KEY extends 'created' | 'modified'
>(
  timestampOptions: TIMESTAMP_OPTIONS,
  timestampKey: TIMESTAMP_KEY
): IsTimestampEnabled<TIMESTAMP_OPTIONS, TIMESTAMP_KEY> =>
  (timestampOptions === true
    ? true
    : isTimestampsObjectOptions(timestampOptions) &&
      (timestampOptions[timestampKey] === true ||
        typeof timestampOptions[timestampKey] === 'object')
    ? true
    : false) as IsTimestampEnabled<TIMESTAMP_OPTIONS, TIMESTAMP_KEY>
