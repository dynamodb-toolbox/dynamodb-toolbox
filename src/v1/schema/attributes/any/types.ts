import type { SharedAttributeStateConstraint } from '../shared/interface'

export interface AnyAttributeStateConstraint extends SharedAttributeStateConstraint {
  castAs: unknown
}
