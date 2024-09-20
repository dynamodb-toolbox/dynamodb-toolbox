import type { SharedAttributeState } from '../shared/interface.js'

export interface NumberAttributeState extends SharedAttributeState {
  enum: number[] | undefined
  transform: undefined | unknown
}
