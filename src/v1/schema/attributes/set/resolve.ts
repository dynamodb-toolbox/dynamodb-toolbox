// import type { Prettify } from 'v1/types'

import type { ResolveAttribute } from '../types'

import type { SetAttribute } from './interface'

export type ResolveSetAttribute<
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends { key: boolean } = { key: false }
  // > = Set<Prettify<ResolveAttribute<ATTRIBUTE['elements'], OPTIONS>>>
> = Set<ResolveAttribute<ATTRIBUTE['elements'], OPTIONS>>
