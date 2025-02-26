import type { BinarySchema } from './schema.js'

export type ResolveBinarySchema<ATTRIBUTE extends BinarySchema> = ATTRIBUTE['props'] extends {
  enum: Uint8Array[]
}
  ? ATTRIBUTE['props']['enum'][number]
  : Uint8Array

export type ResolvedBinarySchema = ResolveBinarySchema<BinarySchema>
