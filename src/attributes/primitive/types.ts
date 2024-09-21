import type {
  $BinaryAttribute,
  $BinaryAttributeNestedState,
  $BinaryAttributeState,
  BinaryAttribute,
  FreezeBinaryAttribute,
  ResolveBinaryAttribute
} from '../binary/index.js'
import type {
  $BooleanAttribute,
  $BooleanAttributeNestedState,
  $BooleanAttributeState,
  BooleanAttribute,
  FreezeBooleanAttribute,
  ResolveBooleanAttribute
} from '../boolean/index.js'
import type {
  $NullAttribute,
  $NullAttributeNestedState,
  $NullAttributeState,
  FreezeNullAttribute,
  NullAttribute,
  ResolveNullAttribute
} from '../null/index.js'
import type {
  $NumberAttribute,
  $NumberAttributeNestedState,
  $NumberAttributeState,
  FreezeNumberAttribute,
  NumberAttribute,
  ResolveNumberAttribute
} from '../number/index.js'
import type {
  $StringAttribute,
  $StringAttributeNestedState,
  $StringAttributeState,
  FreezeStringAttribute,
  ResolveStringAttribute,
  StringAttribute
} from '../string/index.js'
import type { $transformerId } from './constants.js'

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

export type ResolvePrimitiveAttribute<ATTRIBUTE extends PrimitiveAttribute> =
  | (ATTRIBUTE extends NullAttribute ? ResolveNullAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends BooleanAttribute ? ResolveBooleanAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends NumberAttribute ? ResolveNumberAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends StringAttribute ? ResolveStringAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends BinaryAttribute ? ResolveBinaryAttribute<ATTRIBUTE> : never)

export type ResolvedPrimitiveAttribute = ResolvePrimitiveAttribute<PrimitiveAttribute>

export type FreezePrimitiveAttribute<ATTRIBUTE extends $PrimitiveAttributeState> =
  | (ATTRIBUTE extends $NullAttributeState ? FreezeNullAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends $BooleanAttributeState ? FreezeBooleanAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends $NumberAttributeState ? FreezeNumberAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends $StringAttributeState ? FreezeStringAttribute<ATTRIBUTE> : never)
  | (ATTRIBUTE extends $BinaryAttributeState ? FreezeBinaryAttribute<ATTRIBUTE> : never)

export interface Transformer<
  INPUT extends ResolvedPrimitiveAttribute = ResolvedPrimitiveAttribute,
  OUTPUT extends ResolvedPrimitiveAttribute = ResolvedPrimitiveAttribute,
  PARSED_OUTPUT extends ResolvedPrimitiveAttribute = OUTPUT
> {
  parse: (inputValue: INPUT) => OUTPUT
  format: (savedValue: OUTPUT) => PARSED_OUTPUT
}

export interface JSONizableTransformer<
  JSONIZED extends { transformerId: string } & object = { transformerId: string } & object,
  INPUT extends ResolvedPrimitiveAttribute = ResolvedPrimitiveAttribute,
  OUTPUT extends ResolvedPrimitiveAttribute = ResolvedPrimitiveAttribute,
  PARSED_OUTPUT extends ResolvedPrimitiveAttribute = OUTPUT
> extends Transformer<INPUT, OUTPUT, PARSED_OUTPUT> {
  [$transformerId]: JSONIZED['transformerId']
  parse: (inputValue: INPUT) => OUTPUT
  format: (savedValue: OUTPUT) => PARSED_OUTPUT
  jsonize: () => JSONIZED
}
