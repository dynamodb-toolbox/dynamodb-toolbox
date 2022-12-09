import type { ComputedDefault } from '../constants/computedDefault'

/**
 * Possible Primitive Attribute type
 */
export type PrimitiveAttributeType = 'string' | 'boolean' | 'number' | 'binary'

/**
 * Returns the corresponding TS type of a Primitive Attribute type
 *
 * @param T Primitive Type
 */
export type ResolvePrimitiveAttributeType<
  TYPE extends PrimitiveAttributeType
> = TYPE extends 'string'
  ? string
  : TYPE extends 'number'
  ? number
  : TYPE extends 'boolean'
  ? boolean
  : TYPE extends 'binary'
  ? Buffer
  : never

/**
 * TS type of any Primitive Attribute
 */
export type ResolvedPrimitiveAttributeType = ResolvePrimitiveAttributeType<PrimitiveAttributeType>

/**
 * Primitive Enum values constraint
 */
export type PrimitiveAttributeEnumValues<TYPE extends PrimitiveAttributeType> =
  | ResolvePrimitiveAttributeType<TYPE>[]
  | undefined

/**
 * Primitive Default values constraint
 */
export type PrimitiveAttributeDefaultValue<TYPE extends PrimitiveAttributeType> =
  | undefined
  | ComputedDefault
  | ResolvePrimitiveAttributeType<TYPE>
  | (() => ResolvePrimitiveAttributeType<TYPE>)
