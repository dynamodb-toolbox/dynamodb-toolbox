import type { SharedAttributeState } from '../shared/interface.js'

export interface BooleanAttributeState extends SharedAttributeState {
  enum: boolean[] | undefined
  transform: undefined | unknown
}
