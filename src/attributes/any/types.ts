import type { SharedAttributeStateConstraint } from '../shared/interface.js'

export interface AnyAttributeStateConstraint extends SharedAttributeStateConstraint {
  castAs?: unknown
  transform?: undefined | unknown
}
