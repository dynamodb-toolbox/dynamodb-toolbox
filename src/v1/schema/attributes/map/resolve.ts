import type { O } from 'ts-toolbelt'

import type { OptionalizeUndefinableProperties } from 'v1/types'

import type { AnyAttribute } from '../any'
import type { Never } from '../constants'
import type { ResolveAttribute } from '../types'
import type { MapAttribute } from './interface'

export type ResolveMapAttribute<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends { key: boolean } = { key: false }
> = OptionalizeUndefinableProperties<
  {
    [KEY in Extract<
      OPTIONS['key'] extends true
        ? O.SelectKeys<ATTRIBUTE['attributes'], { key: true }>
        : keyof ATTRIBUTE['attributes'],
      string
      // TODO: Prettify here
      // >]: Prettify<ResolveAttribute<ATTRIBUTE['attributes'][KEY], OPTIONS>>
    >]: ResolveAttribute<ATTRIBUTE['attributes'][KEY], OPTIONS>
  },
  // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
  O.SelectKeys<
    ATTRIBUTE['attributes'],
    (OPTIONS['key'] extends true ? { key: true } : unknown) & AnyAttribute & { required: Never }
  >
>
