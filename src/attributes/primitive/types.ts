import type {
  $BinaryAttribute,
  $BinaryAttributeNestedState,
  BinaryAttribute,
  BinaryAttribute_,
  BinarySchema,
  FreezeBinaryAttribute,
  ResolveBinarySchema,
  ResolvedBinarySchema
} from '../binary/index.js'
import type {
  $BooleanAttribute,
  $BooleanAttributeNestedState,
  BooleanAttribute,
  BooleanAttribute_,
  BooleanSchema,
  FreezeBooleanAttribute,
  ResolveBooleanSchema,
  ResolvedBooleanAttribute
} from '../boolean/index.js'
import type {
  $NullAttribute,
  $NullAttributeNestedState,
  FreezeNullAttribute,
  NullAttribute,
  NullAttribute_,
  NullSchema,
  ResolvedNullSchema
} from '../null/index.js'
import type {
  $NumberAttribute,
  $NumberAttributeNestedState,
  FreezeNumberAttribute,
  NumberAttribute,
  NumberAttribute_,
  NumberSchema,
  ResolveNumberSchema,
  ResolvedNumberSchema
} from '../number/index.js'
import type {
  $StringAttribute,
  $StringAttributeNestedState,
  FreezeStringAttribute,
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

export type FreezePrimitiveAttribute<
  ATTRIBUTE extends PrimitiveSchema,
  EXTENDED extends boolean = false
> =
  | (ATTRIBUTE extends NullSchema ? FreezeNullAttribute<ATTRIBUTE, EXTENDED> : never)
  | (ATTRIBUTE extends BooleanSchema ? FreezeBooleanAttribute<ATTRIBUTE, EXTENDED> : never)
  | (ATTRIBUTE extends NumberSchema ? FreezeNumberAttribute<ATTRIBUTE, EXTENDED> : never)
  | (ATTRIBUTE extends StringSchema ? FreezeStringAttribute<ATTRIBUTE, EXTENDED> : never)
  | (ATTRIBUTE extends BinarySchema ? FreezeBinaryAttribute<ATTRIBUTE, EXTENDED> : never)
