import type { SharedAttributeState } from '../shared/interface.js'

export interface NullAttributeState extends SharedAttributeState {
  enum: null[] | undefined
  transform: undefined | unknown
}
