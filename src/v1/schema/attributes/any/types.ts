import type { SharedAttributeState } from '../shared/interface'

export interface AnyAttributeState extends SharedAttributeState {
  castAs: unknown
}
