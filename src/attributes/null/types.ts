import type { SharedAttributeStateConstraint } from '../shared/interface.js'

export interface NullAttributeStateConstraint extends SharedAttributeStateConstraint {
  enum?: null[]
  transform?: unknown
}
