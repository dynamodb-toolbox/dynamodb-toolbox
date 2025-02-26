import type {
  $BinaryAttribute,
  $BinaryAttributeNestedState,
  BinaryAttribute,
  BinaryAttribute_,
  BinarySchema,
  ResolveBinarySchema,
  ResolvedBinarySchema
} from '../binary/index.js'
import type {
  $BooleanAttribute,
  $BooleanAttributeNestedState,
  BooleanAttribute,
  BooleanAttribute_,
  BooleanSchema,
  ResolveBooleanSchema,
  ResolvedBooleanAttribute
} from '../boolean/index.js'
import type {
  $NullAttribute,
  $NullAttributeNestedState,
  NullAttribute,
  NullAttribute_,
  NullSchema,
  ResolvedNullSchema
} from '../null/index.js'
import type {
  $NumberAttribute,
  $NumberAttributeNestedState,
  NumberAttribute,
  NumberAttribute_,
  NumberSchema,
  ResolveNumberSchema,
  ResolvedNumberSchema
} from '../number/index.js'
import type {
  $StringAttribute,
  $StringAttributeNestedState,
  ResolveStringSchema,
  ResolvedStringSchema,
  StringAttribute,
  StringAttribute_,
  StringSchema
} from '../string/index.js'

export type $PrimitiveAttributeNestedState =
  | $NullAttributeNestedState
  | $BooleanAttributeNestedState
  | $NumberAttributeNestedState
  | $StringAttributeNestedState
  | $BinaryAttributeNestedState

export type PrimitiveSchema =
  | NullSchema
  | BooleanSchema
  | NumberSchema
  | StringSchema
  | BinarySchema

export type $PrimitiveAttribute =
  | $NullAttribute
  | $BooleanAttribute
  | $NumberAttribute
  | $StringAttribute
  | $BinaryAttribute

export type PrimitiveAttribute =
  | NullAttribute
  | BooleanAttribute
  | NumberAttribute
  | StringAttribute
  | BinaryAttribute

export type PrimitiveAttribute_ =
  | NullAttribute_
  | BooleanAttribute_
  | NumberAttribute_
  | StringAttribute_
  | BinaryAttribute_

export type ResolvedPrimitiveSchema =
  | ResolvedNullSchema
  | ResolvedBooleanAttribute
  | ResolvedNumberSchema
  | ResolvedStringSchema
  | ResolvedBinarySchema

export type ResolvePrimitiveSchema<ATTRIBUTE extends PrimitiveSchema> =
  PrimitiveSchema extends ATTRIBUTE
    ? ResolvedPrimitiveSchema
    :
        | (ATTRIBUTE extends NullSchema ? ResolvedNullSchema : never)
        | (ATTRIBUTE extends BooleanSchema ? ResolveBooleanSchema<ATTRIBUTE> : never)
        | (ATTRIBUTE extends NumberSchema ? ResolveNumberSchema<ATTRIBUTE> : never)
        | (ATTRIBUTE extends StringSchema ? ResolveStringSchema<ATTRIBUTE> : never)
        | (ATTRIBUTE extends BinarySchema ? ResolveBinarySchema<ATTRIBUTE> : never)
