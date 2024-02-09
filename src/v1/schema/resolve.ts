import type { O } from 'ts-toolbelt'

import type { OptionalizeUndefinableProperties, Prettify } from 'v1/types'
import type { AnyAttribute, Never, ResolveAttribute } from './attributes'
import type { Schema } from './interface'

export type ResolveSchema<
  SCHEMA extends Schema,
  OPTIONS extends { key: boolean } = { key: false }
> = OptionalizeUndefinableProperties<
  {
    [KEY in Extract<
      OPTIONS['key'] extends true
        ? O.SelectKeys<SCHEMA['attributes'], { key: true }>
        : keyof SCHEMA['attributes'],
      string
    >]: Prettify<ResolveAttribute<SCHEMA['attributes'][KEY], OPTIONS>>
  },
  // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
  O.SelectKeys<
    SCHEMA['attributes'],
    (OPTIONS['key'] extends true ? { key: true } : unknown) & AnyAttribute & { required: Never }
  >
>
