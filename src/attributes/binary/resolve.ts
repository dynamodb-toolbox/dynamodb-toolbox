import type { BinarySchema } from './interface.js'

export type ResolveBinarySchema<ATTRIBUTE extends BinarySchema> = ATTRIBUTE['state'] extends {
  enum: Uint8Array[]
}
  ? ATTRIBUTE['state']['enum'][number]
  : Uint8Array

export type ResolvedBinarySchema = ResolveBinarySchema<BinarySchema>
