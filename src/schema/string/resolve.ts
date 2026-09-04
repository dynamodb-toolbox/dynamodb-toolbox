import type { StringSchema } from './schema.js'

/**
 * Resolves a string schema to its runtime type.
 */
export type ResolveStringSchema<SCHEMA extends StringSchema> = SCHEMA['props'] extends {
  enum: string[]
}
  ? SCHEMA['props']['enum'][number]
  : string

/**
 * Runtime type of a string schema (`string`).
 */
export type ResolvedStringSchema = ResolveStringSchema<StringSchema>
