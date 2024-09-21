import type { ResolvedNumberAttribute } from '../number/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { ResolvedStringAttribute } from '../string/index.js'
import type { $transformerId } from './constants.js'

export interface PrimitiveAttributeState<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType
> extends SharedAttributeState {
  enum: PrimitiveAttributeEnumValues<TYPE>
  transform: undefined | unknown
}

/**
 * Possible Primitive Attribute type
 */
export type PrimitiveAttributeType = 'null' | 'boolean' | 'binary'

/**
 * Returns the corresponding TS type of a Primitive Attribute type
 *
 * @param TYPE Primitive Type
 */
export type ResolvePrimitiveAttributeType<TYPE extends PrimitiveAttributeType> = TYPE extends 'null'
  ? null
  : TYPE extends 'boolean'
    ? boolean
    : TYPE extends 'binary'
      ? Uint8Array
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
  INPUT extends ResolvedPrimitiveAttribute | ResolvedNumberAttribute | ResolvedStringAttribute =
    | ResolvedPrimitiveAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute,
  OUTPUT extends ResolvedPrimitiveAttribute | ResolvedNumberAttribute | ResolvedStringAttribute =
    | ResolvedPrimitiveAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute,
  PARSED_OUTPUT extends
    | ResolvedPrimitiveAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute = OUTPUT
> {
  parse: (inputValue: INPUT) => OUTPUT
  format: (savedValue: OUTPUT) => PARSED_OUTPUT
}

export interface JSONizableTransformer<
  JSONIZED extends { transformerId: string } & object = { transformerId: string } & object,
  INPUT extends ResolvedPrimitiveAttribute | ResolvedStringAttribute | ResolvedNumberAttribute =
    | ResolvedPrimitiveAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute,
  OUTPUT extends ResolvedPrimitiveAttribute | ResolvedNumberAttribute | ResolvedStringAttribute =
    | ResolvedPrimitiveAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute,
  PARSED_OUTPUT extends
    | ResolvedPrimitiveAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute = OUTPUT
> extends Transformer<INPUT, OUTPUT, PARSED_OUTPUT> {
  [$transformerId]: JSONIZED['transformerId']
  parse: (inputValue: INPUT) => OUTPUT
  format: (savedValue: OUTPUT) => PARSED_OUTPUT
  jsonize: () => JSONIZED
}
