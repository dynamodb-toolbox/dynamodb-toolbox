import type {
  BinarySchema,
  BinarySchema_,
  ResolveBinarySchema,
  ResolvedBinarySchema
} from '../binary/index.js'
import type {
  BooleanSchema,
  BooleanSchema_,
  ResolveBooleanSchema,
  ResolvedBooleanAttribute
} from '../boolean/index.js'
import type { NullSchema, NullSchema_, ResolvedNullSchema } from '../null/index.js'
import type {
  NumberSchema,
  NumberSchema_,
  ResolveNumberSchema,
  ResolvedNumberSchema
} from '../number/index.js'
import type {
  ResolveStringSchema,
  ResolvedStringSchema,
  StringSchema,
  StringSchema_
} from '../string/index.js'

export type PrimitiveSchema =
  | NullSchema
  | BooleanSchema
  | NumberSchema
  | StringSchema
  | BinarySchema

export type PrimitiveSchema_ =
  | NullSchema_
  | BooleanSchema_
  | NumberSchema_
  | StringSchema_
  | BinarySchema_

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
