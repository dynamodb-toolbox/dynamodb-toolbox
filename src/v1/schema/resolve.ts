import type { A, O } from 'ts-toolbelt'

import type { OptionalizeUndefinableProperties } from 'v1/types'
import type { AnyAttribute, Never, ResolveAttribute } from './attributes'
import type { Schema } from './interface'

export type ResolveSchema<SCHEMA extends Schema> = A.Compute<
  OptionalizeUndefinableProperties<
    {
      [KEY in Extract<keyof SCHEMA['attributes'], string>]: ResolveAttribute<
        SCHEMA['attributes'][KEY]
      >
    },
    // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
    O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: Never }>
  >
>
