import type { O } from 'ts-toolbelt'

import type { OptionalizeUndefinableProperties } from 'v1/types'

import type { AnyAttribute } from '../any'
import type { Never } from '../constants'
import type { ResolveAttribute } from '../types'
import type { MapAttribute } from './interface'

export type ResolveMapAttribute<ATTRIBUTE extends MapAttribute> = OptionalizeUndefinableProperties<
  {
    [KEY in Extract<keyof ATTRIBUTE['attributes'], string>]: ResolveAttribute<
      ATTRIBUTE['attributes'][KEY]
    >
  },
  // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
  O.SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
>
