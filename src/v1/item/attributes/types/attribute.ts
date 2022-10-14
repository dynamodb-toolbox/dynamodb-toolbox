import { LeafAttribute, ResolvedLeafAttributeType } from '../leaf'
import { MapAttribute } from '../map'
import { ListAttribute } from '../list'
import { SetAttribute } from '../set'
import { AnyAttribute } from '../any'

/**
 * Possible attributes types
 */
export type Attribute = AnyAttribute | LeafAttribute | MapAttribute | ListAttribute | SetAttribute

/**
 * Dictionary of attributes
 */
export interface MapAttributeAttributes {
  [key: string]: Attribute
}

/**
 * Any possible resolved attribute type
 */
export type ResolvedAttribute =
  | ResolvedLeafAttributeType
  | ResolvedAttribute[]
  | Set<ResolvedAttribute>
  | { [key: string]: ResolvedAttribute }
