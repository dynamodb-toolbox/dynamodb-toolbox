import type { ResolveAttribute } from '../types'

import type { SetAttribute } from './interface'

export type ResolveSetAttribute<ATTRIBUTE extends SetAttribute> = Set<
  ResolveAttribute<ATTRIBUTE['elements']>
>
