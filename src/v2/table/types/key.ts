import { IndexableKeyType } from './keyType'

export interface Key<N extends string = string, T extends IndexableKeyType = IndexableKeyType> {
  name: N
  type: T
}

export type NarrowKey<I extends Key> = {
  [K in keyof I]: I[K]
}
