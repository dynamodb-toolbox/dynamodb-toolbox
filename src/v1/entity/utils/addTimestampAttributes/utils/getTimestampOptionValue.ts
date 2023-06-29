import type { TimestampsOptions } from '../timestampOptions'
import { TIMESTAMPS_DEFAULTS_OPTIONS, TimestampsDefaultOptions } from '../timestampDefaultOptions'

import { isTimestampsObjectOptions } from './isTimestampsObjectOptions'
import { isTimestampObjectOptions } from './isTimestampObjectOptions'

export type TimestampOptionValue<
  TIMESTAMP_OPTIONS extends TimestampsOptions,
  TIMESTAMP_KEY extends 'created' | 'modified',
  OPTION_KEY extends 'name' | 'savedAs' | 'hidden'
> = TIMESTAMP_OPTIONS extends { [KEY in TIMESTAMP_KEY]: { [KEY in OPTION_KEY]: unknown } }
  ? TIMESTAMP_OPTIONS[TIMESTAMP_KEY][OPTION_KEY]
  : TimestampsDefaultOptions[TIMESTAMP_KEY][OPTION_KEY]

export const getTimestampOptionValue = <
  TIMESTAMP_OPTIONS extends TimestampsOptions,
  TIMESTAMP_KEY extends 'created' | 'modified',
  OPTION_KEY extends 'name' | 'savedAs' | 'hidden'
>(
  timestampsOptions: TIMESTAMP_OPTIONS,
  timestampKey: TIMESTAMP_KEY,
  optionKey: OPTION_KEY
): TimestampOptionValue<TIMESTAMP_OPTIONS, TIMESTAMP_KEY, OPTION_KEY> => {
  if (isTimestampsObjectOptions(timestampsOptions)) {
    const timestampOptions = timestampsOptions[timestampKey]

    return (isTimestampObjectOptions(timestampOptions)
      ? timestampOptions[optionKey]
      : TIMESTAMPS_DEFAULTS_OPTIONS[timestampKey][optionKey]) as TimestampOptionValue<
      TIMESTAMP_OPTIONS,
      TIMESTAMP_KEY,
      OPTION_KEY
    >
  }

  return TIMESTAMPS_DEFAULTS_OPTIONS[timestampKey][optionKey] as TimestampOptionValue<
    TIMESTAMP_OPTIONS,
    TIMESTAMP_KEY,
    OPTION_KEY
  >
}
