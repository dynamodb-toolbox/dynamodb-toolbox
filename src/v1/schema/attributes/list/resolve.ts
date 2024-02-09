import type { Prettify } from 'v1/types'

import type { ResolveAttribute } from '../types'
import type { ListAttribute } from './interface'

export type ResolveListAttribute<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends { key: boolean } = { key: false }
> = Prettify<ResolveAttribute<ATTRIBUTE['elements'], OPTIONS>>[]
