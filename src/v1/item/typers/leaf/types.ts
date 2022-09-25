import type { ComputedDefault } from '../constants/computedDefault'

/**
 * Possible Leaf Attribute type
 */
export type LeafType = 'string' | 'boolean' | 'number' | 'binary'

/**
 * Returns the corresponding TS type of a Leaf Attribute type
 *
 * @param T Leaf Type
 */
export type ResolveLeafType<Type extends LeafType> = Type extends 'string'
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
export type ResolvedLeafType = ResolveLeafType<LeafType>

/**
 * Leaf Enum values constraint
 */
export type EnumValues<Type extends LeafType> = ResolveLeafType<Type>[] | undefined

/**
 * Leaf Default values constraint
 */
export type LeafDefaultValue<Type extends LeafType> =
  | undefined
  | ComputedDefault
  | ResolveLeafType<Type>
  | (() => ResolveLeafType<Type>)
