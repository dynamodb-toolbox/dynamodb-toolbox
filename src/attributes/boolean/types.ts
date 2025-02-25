import type { SharedAttributeStateConstraint } from '../shared/interface.js'

export interface BooleanAttributeStateConstraint extends SharedAttributeStateConstraint {
  enum?: boolean[]
  transform?: unknown
}
