import type { BinaryAttribute } from './interface.js'
import type { BinaryAttributeState } from './types.js'

export type ResolveBinaryAttribute<ATTRIBUTE extends BinaryAttribute> = ATTRIBUTE extends {
  enum: NonNullable<BinaryAttributeState['enum']>
}
  ? ATTRIBUTE['enum'][number]
  : Uint8Array

export type ResolvedBinaryAttribute = ResolveBinaryAttribute<BinaryAttribute>
