import { Leaf, ResolvedLeafType } from '../leaf'
import { Mapped } from '../map'
import { List } from '../list'
import { SetAttribute } from '../set'
import { Any } from '../any'

/**
 * Possible attributes types
 */
export type Attribute = Any | Leaf | Mapped | List | SetAttribute

/**
 * Dictionary of attributes
 */
export interface MappedAttributes {
  [key: string]: Attribute
}

/**
 * Any possible resolved attribute type
 */
export type ResolvedAttribute =
  | ResolvedLeafType
  | ResolvedAttribute[]
  | Set<ResolvedAttribute>
  | { [key: string]: ResolvedAttribute }
