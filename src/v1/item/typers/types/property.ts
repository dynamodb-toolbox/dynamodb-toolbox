import { Leaf, ResolvedLeafType } from '../leaf'
import { Mapped } from '../map'
import { List } from '../list'
import { Any } from '../any'

/**
 * Possible properties types
 */
export type Property = Any | Leaf | Mapped | List

/**
 * Dictionary of properties
 */
export interface MappedProperties {
  [key: string]: Property
}

/**
 * Any possible resolved property type
 */
export type ResolvedProperty =
  | ResolvedLeafType
  | ResolvedProperty[]
  | { [key: string]: ResolvedProperty }
