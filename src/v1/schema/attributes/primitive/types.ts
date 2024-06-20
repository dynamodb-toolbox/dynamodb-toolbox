import type { SharedAttributeState } from '../shared/interface.js'

export interface PrimitiveAttributeState<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType
> extends SharedAttributeState {
  enum: PrimitiveAttributeEnumValues<TYPE>
  transform: undefined | unknown
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

export interface Transformer<
  INPUT extends ResolvedPrimitiveAttribute = ResolvedPrimitiveAttribute,
  OUTPUT extends ResolvedPrimitiveAttribute = ResolvedPrimitiveAttribute,
  PARSED_OUTPUT extends ResolvedPrimitiveAttribute = OUTPUT
> {
  parse: (inputValue: INPUT) => OUTPUT
  format: (savedValue: OUTPUT) => PARSED_OUTPUT
}
