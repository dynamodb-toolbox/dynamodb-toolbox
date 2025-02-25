import type { SharedAttributeState } from '../shared/interface.js'

export interface BinaryAttributeState extends SharedAttributeState {
  enum?: Uint8Array[]
  transform?: unknown
}
