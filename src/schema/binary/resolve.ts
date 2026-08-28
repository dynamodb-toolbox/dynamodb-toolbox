import type { BinarySchema } from './schema.js'

/**
 * Resolves a binary schema to its runtime type.
 */
export type ResolveBinarySchema<SCHEMA extends BinarySchema> = SCHEMA['props'] extends {
  enum: Uint8Array[]
}
  ? SCHEMA['props']['enum'][number]
  : Uint8Array

/**
 * Runtime type of a binary schema (`Uint8Array`).
 */
export type ResolvedBinarySchema = ResolveBinarySchema<BinarySchema>
