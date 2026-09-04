import type { BooleanSchema } from './schema.js'

/**
 * Resolves a boolean schema to its runtime type.
 */
export type ResolveBooleanSchema<SCHEMA extends BooleanSchema> = SCHEMA['props'] extends {
  enum: boolean[]
}
  ? SCHEMA['props']['enum'][number]
  : boolean

/**
 * Runtime type of a boolean schema (`boolean`).
 */
export type ResolvedBooleanSchema = ResolveBooleanSchema<BooleanSchema>
