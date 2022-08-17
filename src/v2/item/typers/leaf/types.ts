import type { ComputedDefault } from '../constants/computedDefault'

/**
 * Possible Leaf Property type
 */
export type LeafType = 'string' | 'boolean' | 'number' | 'binary'

/**
 * Returns the corresponding TS type of a Leaf Property type
 *
 * @param T Leaf Type
 */
export type ResolveLeafType<T extends LeafType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends 'binary'
  ? Buffer
  : never

/**
 * TS type of any Leaf Property
 */
export type ResolvedLeafType = ResolveLeafType<LeafType>

/**
 * Leaf Enum values constraint
 */
export type EnumValues<T extends LeafType> = ResolveLeafType<T>[] | undefined

/**
 * Leaf Default values constraint
 */
export type LeafDefaultValue<T extends LeafType> =
  | undefined
  | ComputedDefault
  | ResolveLeafType<T>
  | (() => ResolveLeafType<T>)
