import { Leaf } from './leaf'
import { Mapped } from './map'
import { List } from './list'

export type Property = Leaf | Mapped | List

export interface MappedProperties {
  [key: string]: Property
}
