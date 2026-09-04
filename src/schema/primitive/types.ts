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
  ResolvedBooleanSchema
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

/**
 * Union of the primitive (non-collection) schema classes: `null`, `boolean`, `number`, `string` and `binary`.
 */
export type PrimitiveSchema =
  | NullSchema
  | BooleanSchema
  | NumberSchema
  | StringSchema
  | BinarySchema

/**
 * Union of the builder primitive schema classes.
 */
export type PrimitiveSchema_ =
  | NullSchema_
  | BooleanSchema_
  | NumberSchema_
  | StringSchema_
  | BinarySchema_

/**
 * Runtime type of an unconstrained primitive schema — the union of every primitive's resolved type.
 */
export type ResolvedPrimitiveSchema =
  | ResolvedNullSchema
  | ResolvedBooleanSchema
  | ResolvedNumberSchema
  | ResolvedStringSchema
  | ResolvedBinarySchema

/**
 * Resolves a primitive schema to its runtime type by dispatching to the matching per-type resolver.
 */
export type ResolvePrimitiveSchema<SCHEMA extends PrimitiveSchema> = PrimitiveSchema extends SCHEMA
  ? ResolvedPrimitiveSchema
  :
      | (SCHEMA extends NullSchema ? ResolvedNullSchema : never)
      | (SCHEMA extends BooleanSchema ? ResolveBooleanSchema<SCHEMA> : never)
      | (SCHEMA extends NumberSchema ? ResolveNumberSchema<SCHEMA> : never)
      | (SCHEMA extends StringSchema ? ResolveStringSchema<SCHEMA> : never)
      | (SCHEMA extends BinarySchema ? ResolveBinarySchema<SCHEMA> : never)
