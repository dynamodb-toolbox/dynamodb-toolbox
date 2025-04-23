import { isObject } from '~/utils/validation/isObject.js'

import type {
  EntityAttrDefaultOptions,
  EntityAttrOptions,
  TimestampsDefaultOptions,
  TimestampsOptions
} from './options.js'

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
): IsTimestampEnabled<TIMESTAMP_OPTIONS, TIMESTAMP_KEY> => {
  if (timestampOptions === true) {
    return true as IsTimestampEnabled<TIMESTAMP_OPTIONS, TIMESTAMP_KEY>
  }

  if (isObject(timestampOptions)) {
    const timestampOptionsValue = timestampOptions[timestampKey]

    if (timestampOptionsValue === true || typeof timestampOptionsValue === 'object') {
      return true as IsTimestampEnabled<TIMESTAMP_OPTIONS, TIMESTAMP_KEY>
    }
  }

  return false as IsTimestampEnabled<TIMESTAMP_OPTIONS, TIMESTAMP_KEY>
}

const TIMESTAMPS_DEFAULTS_OPTIONS: TimestampsDefaultOptions = {
  created: { name: 'created', savedAs: '_ct', hidden: false },
  modified: { name: 'modified', savedAs: '_md', hidden: false }
}

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
  const defaultOptions = TIMESTAMPS_DEFAULTS_OPTIONS[timestampKey][
    optionKey
  ] as TimestampOptionValue<TIMESTAMP_OPTIONS, TIMESTAMP_KEY, OPTION_KEY>

  if (isObject(timestampsOptions)) {
    const timestampOptions = timestampsOptions[timestampKey]

    return isObject(timestampOptions)
      ? ((timestampOptions[optionKey] as TimestampOptionValue<
          TIMESTAMP_OPTIONS,
          TIMESTAMP_KEY,
          OPTION_KEY
        >) ?? defaultOptions)
      : defaultOptions
  }

  return defaultOptions
}

export type IsEntityAttrEnabled<ENTITY_ATTR_OPTIONS extends EntityAttrOptions> =
  ENTITY_ATTR_OPTIONS extends true | Record<string, unknown> ? true : false

export const isEntityAttrEnabled = <ENTITY_ATTR_OPTIONS extends EntityAttrOptions>(
  entityAttrOptions: ENTITY_ATTR_OPTIONS
): IsEntityAttrEnabled<ENTITY_ATTR_OPTIONS> =>
  Boolean(entityAttrOptions) as IsEntityAttrEnabled<ENTITY_ATTR_OPTIONS>

const ENTITY_ATTR_DEFAULTS_OPTIONS: EntityAttrDefaultOptions = {
  name: 'entity',
  hidden: true
}

export type EntityAttrOptionValue<
  ENTITY_ATTR_OPTIONS extends EntityAttrOptions,
  OPTION_KEY extends 'name' | 'hidden'
> = ENTITY_ATTR_OPTIONS extends { [KEY in OPTION_KEY]: unknown }
  ? ENTITY_ATTR_OPTIONS[OPTION_KEY]
  : EntityAttrDefaultOptions[OPTION_KEY]

export const getEntityAttrOptionValue = <
  ENTITY_ATTR_OPTIONS extends EntityAttrOptions,
  OPTION_KEY extends 'name' | 'hidden'
>(
  entityAttrOptions: ENTITY_ATTR_OPTIONS,
  optionKey: OPTION_KEY
): EntityAttrOptionValue<ENTITY_ATTR_OPTIONS, OPTION_KEY> => {
  const defaultOptions = ENTITY_ATTR_DEFAULTS_OPTIONS[optionKey] as EntityAttrOptionValue<
    ENTITY_ATTR_OPTIONS,
    OPTION_KEY
  >

  return isObject(entityAttrOptions)
    ? ((entityAttrOptions[optionKey] as EntityAttrOptionValue<ENTITY_ATTR_OPTIONS, OPTION_KEY>) ??
        defaultOptions)
    : defaultOptions
}
