import type { SharedAttributeStateConstraint } from '../shared/interface.js'

export interface BinaryAttributeStateConstraint extends SharedAttributeStateConstraint {
  enum?: Uint8Array[]
  transform?: unknown
}
