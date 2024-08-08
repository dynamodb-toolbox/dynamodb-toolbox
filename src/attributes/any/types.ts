import type { SharedAttributeState } from '../shared/interface.js'

export interface AnyAttributeState extends SharedAttributeState {
  castAs: unknown
}
