import type { ComputedDefault } from '../constants/computedDefault'

/**
 * Possible Leaf Attribute type
 */
export type LeafAttributeType = 'string' | 'boolean' | 'number' | 'binary'

/**
 * Returns the corresponding TS type of a Leaf Attribute type
 *
 * @param T Leaf Type
 */
export type ResolveLeafAttributeType<Type extends LeafAttributeType> = Type extends 'string'
  ? string
  : Type extends 'number'
  ? number
  : Type extends 'boolean'
  ? boolean
  : Type extends 'binary'
  ? Buffer
  : never

/**
 * TS type of any Leaf Attribute
 */
export type ResolvedLeafAttributeType = ResolveLeafAttributeType<LeafAttributeType>

/**
 * Leaf Enum values constraint
 */
export type LeafAttributeEnumValues<Type extends LeafAttributeType> =
  | ResolveLeafAttributeType<Type>[]
  | undefined

/**
 * Leaf Default values constraint
 */
export type LeafAttributeDefaultValue<Type extends LeafAttributeType> =
  | undefined
  | ComputedDefault
  | ResolveLeafAttributeType<Type>
  | (() => ResolveLeafAttributeType<Type>)
