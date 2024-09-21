import type { SharedAttributeState } from '../shared/interface.js'

export interface StringAttributeState extends SharedAttributeState {
  enum: string[] | undefined
  transform: undefined | unknown
}
