import type { SharedAttributeStateConstraint } from '../shared/interface.js'

export interface NumberAttributeStateConstraint extends SharedAttributeStateConstraint {
  big?: boolean
  enum?: (number | bigint)[]
  transform?: unknown
}
