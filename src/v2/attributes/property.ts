import { Leaf, ResolvedLeafType } from './leaf'
import { Mapped } from './map'
import { List } from './list'

export type Property = Leaf | Mapped | List

export interface MappedProperties {
  [key: string]: Property
}

export type ResolvedProperty =
  | ResolvedLeafType
  | ResolvedLeafType[]
  | { [key: string]: ResolvedProperty }
