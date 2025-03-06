import type { BinarySchema } from './schema.js'

export type ResolveBinarySchema<SCHEMA extends BinarySchema> = SCHEMA['props'] extends {
  enum: Uint8Array[]
}
  ? SCHEMA['props']['enum'][number]
  : Uint8Array

export type ResolvedBinarySchema = ResolveBinarySchema<BinarySchema>
