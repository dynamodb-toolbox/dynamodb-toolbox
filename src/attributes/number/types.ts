import type { SharedAttributeState } from '../shared/interface.js'

export interface NumberAttributeState extends SharedAttributeState {
  big?: boolean
  enum?: (number | bigint)[]
  transform?: unknown
}
