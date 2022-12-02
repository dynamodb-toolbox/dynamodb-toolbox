import { IndexableKeyType } from './keyType'

/**
 * Define a partition or sort key of a Table
 *
 * @param KeyName Key attribute name
 * @param KeyType Key value type
 * @return Key
 */
export interface Key<
  KEY_NAME extends string = string,
  KEY_TYPE extends IndexableKeyType = IndexableKeyType
> {
  name: KEY_NAME
  type: KEY_TYPE
}

/**
 * Utility type to narrow the inferred keys types of a table
 *
 * @param KeyInput Key
 * @return Key
 */
export type NarrowKey<KEY_INPUT extends Key> = {
  [Property in keyof KEY_INPUT]: KEY_INPUT[Property]
}
