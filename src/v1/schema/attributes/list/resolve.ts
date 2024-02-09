import type { ResolveAttribute } from '../types'
import type { ListAttribute } from './interface'

export type ResolveListAttribute<ATTRIBUTE extends ListAttribute> = ResolveAttribute<
  ATTRIBUTE['elements']
>[]
