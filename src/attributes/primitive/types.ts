import type {
  $BinaryAttribute,
  $BinaryAttributeNestedState,
  BinaryAttribute,
  BinaryAttribute_,
  BinarySchema,
  FreezeBinaryAttribute,
  ResolveBinaryAttribute,
  ResolvedBinaryAttribute
} from '../binary/index.js'
import type {
  $BooleanAttribute,
  $BooleanAttributeNestedState,
  BooleanAttribute,
  BooleanAttribute_,
  BooleanSchema,
  FreezeBooleanAttribute,
  ResolveBooleanAttribute,
  ResolvedBooleanAttribute
} from '../boolean/index.js'
import type {
  $NullAttribute,
  $NullAttributeNestedState,
  FreezeNullAttribute,
  NullAttribute,
  NullAttribute_,
  NullSchema,
  ResolvedNullAttribute
} from '../null/index.js'
import type {
  $NumberAttribute,
  $NumberAttributeNestedState,
  FreezeNumberAttribute,
  NumberAttribute,
  NumberAttribute_,
  NumberSchema,
  ResolveNumberAttribute,
  ResolvedNumberAttribute
} from '../number/index.js'
import type {
  $StringAttribute,
  $StringAttributeNestedState,
  FreezeStringAttribute,
  ResolveStringAttribute,
  ResolvedStringAttribute,
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

export type ResolvedPrimitiveAttribute =
  | ResolvedNullAttribute
  | ResolvedBooleanAttribute
  | ResolvedNumberAttribute
  | ResolvedStringAttribute
  | ResolvedBinaryAttribute

export type ResolvePrimitiveAttribute<ATTRIBUTE extends PrimitiveAttribute> =
  PrimitiveAttribute extends ATTRIBUTE
    ? ResolvedPrimitiveAttribute
    :
        | (ATTRIBUTE extends NullAttribute ? ResolvedNullAttribute : never)
        | (ATTRIBUTE extends BooleanAttribute ? ResolveBooleanAttribute<ATTRIBUTE> : never)
        | (ATTRIBUTE extends NumberAttribute ? ResolveNumberAttribute<ATTRIBUTE> : never)
        | (ATTRIBUTE extends StringAttribute ? ResolveStringAttribute<ATTRIBUTE> : never)
        | (ATTRIBUTE extends BinaryAttribute ? ResolveBinaryAttribute<ATTRIBUTE> : never)

export type FreezePrimitiveAttribute<
  ATTRIBUTE extends PrimitiveSchema,
  EXTENDED extends boolean = false
> =
  | (ATTRIBUTE extends NullSchema ? FreezeNullAttribute<ATTRIBUTE, EXTENDED> : never)
  | (ATTRIBUTE extends BooleanSchema ? FreezeBooleanAttribute<ATTRIBUTE, EXTENDED> : never)
  | (ATTRIBUTE extends NumberSchema ? FreezeNumberAttribute<ATTRIBUTE, EXTENDED> : never)
  | (ATTRIBUTE extends StringSchema ? FreezeStringAttribute<ATTRIBUTE, EXTENDED> : never)
  | (ATTRIBUTE extends BinarySchema ? FreezeBinaryAttribute<ATTRIBUTE, EXTENDED> : never)
