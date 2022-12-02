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
export type ResolveLeafAttributeType<TYPE extends LeafAttributeType> = TYPE extends 'string'
  ? string
  : TYPE extends 'number'
  ? number
  : TYPE extends 'boolean'
  ? boolean
  : TYPE extends 'binary'
  ? Buffer
  : never

/**
 * TS type of any Leaf Attribute
 */
export type ResolvedLeafAttributeType = ResolveLeafAttributeType<LeafAttributeType>

/**
 * Leaf Enum values constraint
 */
export type LeafAttributeEnumValues<TYPE extends LeafAttributeType> =
  | ResolveLeafAttributeType<TYPE>[]
  | undefined

/**
 * Leaf Default values constraint
 */
export type LeafAttributeDefaultValue<TYPE extends LeafAttributeType> =
  | undefined
  | ComputedDefault
  | ResolveLeafAttributeType<TYPE>
  | (() => ResolveLeafAttributeType<TYPE>)
