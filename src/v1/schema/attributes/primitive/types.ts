import type { SharedAttributeStateConstraint } from '../shared/interface'

export interface PrimitiveAttributeStateConstraint<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType
> extends SharedAttributeStateConstraint {
  enum: PrimitiveAttributeEnumValues<TYPE>
}

/**
 * Possible Primitive Attribute type
 */
export type PrimitiveAttributeType = 'string' | 'boolean' | 'number' | 'binary'

/**
 * Returns the corresponding TS type of a Primitive Attribute type
 *
 * @param TYPE Primitive Type
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
export type ResolvedPrimitiveAttribute = ResolvePrimitiveAttributeType<PrimitiveAttributeType>

/**
 * Primitive Enum values constraint
 */
export type PrimitiveAttributeEnumValues<TYPE extends PrimitiveAttributeType> =
  | ResolvePrimitiveAttributeType<TYPE>[]
  | undefined
