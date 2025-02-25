import type { BinaryAttribute } from './interface.js'

export type ResolveBinaryAttribute<ATTRIBUTE extends BinaryAttribute> = ATTRIBUTE['state'] extends {
  enum: Uint8Array[]
}
  ? ATTRIBUTE['state']['enum'][number]
  : Uint8Array

export type ResolvedBinaryAttribute = ResolveBinaryAttribute<BinaryAttribute>
