import type { SharedAttributeState } from '../shared/interface.js'

export interface BooleanAttributeState extends SharedAttributeState {
  enum?: boolean[]
  transform?: unknown
}
