import type {
  $BinaryAttribute,
  $BinaryAttributeNestedState,
  $BinaryAttributeState,
  BinaryAttribute,
  FreezeBinaryAttribute,
  ResolveBinaryAttribute,
  ResolvedBinaryAttribute
} from '../binary/index.js'
import type {
  $BooleanAttribute,
  $BooleanAttributeNestedState,
  $BooleanAttributeState,
  BooleanAttribute,
  FreezeBooleanAttribute,
  ResolveBooleanAttribute,
  ResolvedBooleanAttribute
} from '../boolean/index.js'
import type {
  $NullAttribute,
  $NullAttributeNestedState,
  $NullAttributeState,
  FreezeNullAttribute,
  NullAttribute,
  ResolvedNullAttribute
} from '../null/index.js'
import type {
  $NumberAttribute,
  $NumberAttributeNestedState,
  $NumberAttributeState,
  FreezeNumberAttribute,
  NumberAttribute,
  ResolveNumberAttribute,
  ResolvedNumberAttribute
} from '../number/index.js'
import type {
  $StringAttribute,
  $StringAttributeNestedState,
  $StringAttributeState,
  FreezeStringAttribute,
  ResolveStringAttribute,
  ResolvedStringAttribute,
  StringAttribute
} from '../string/index.js'

export type $PrimitiveAttributeNestedState =
  | $NullAttributeNestedState
  | $BooleanAttributeNestedState
  | $NumberAttributeNestedState
  | $StringAttributeNestedState
  | $BinaryAttributeNestedState

export type $PrimitiveAttributeState =
  | $NullAttributeState
  | $BooleanAttributeState
  | $NumberAttributeState
  | $StringAttributeState
  | $BinaryAttributeState

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

export type FreezePrimitiveAttribute<ATTRIBUTE extends $PrimitiveAttributeState> =
  | (ATTRIBUTE extends $NullAttributeState ? FreezeNullAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends $BooleanAttributeState ? FreezeBooleanAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends $NumberAttributeState ? FreezeNumberAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends $StringAttributeState ? FreezeStringAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends $BinaryAttributeState ? FreezeBinaryAttribute<ATTRIBUTE> : never)
