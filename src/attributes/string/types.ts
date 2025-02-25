import type { SharedAttributeStateConstraint } from '../shared/interface.js'

export interface StringAttributeStateConstraint extends SharedAttributeStateConstraint {
  enum?: string[]
  transform?: unknown
}
