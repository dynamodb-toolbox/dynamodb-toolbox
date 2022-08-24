import { IndexableKeyType } from './keyType'

/**
 * Define a partition or sort key of a Table
 *
 * @param N Key attribute name
 * @param T Key value type
 * @return Key
 */
export interface Key<N extends string = string, T extends IndexableKeyType = IndexableKeyType> {
  name: N
  type: T
}

/**
 * Utility type to narrow the inferred keys types of a table
 *
 * @param K Key
 * @return Key
 */
export type NarrowKey<K extends Key> = {
  [P in keyof K]: K[P]
}
