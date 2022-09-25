import { IndexableKeyType } from './keyType'

/**
 * Define a partition or sort key of a Table
 *
 * @param KeyName Key attribute name
 * @param KeyType Key value type
 * @return Key
 */
export interface Key<
  KeyName extends string = string,
  KeyType extends IndexableKeyType = IndexableKeyType
> {
  name: KeyName
  type: KeyType
}

/**
 * Utility type to narrow the inferred keys types of a table
 *
 * @param KeyInput Key
 * @return Key
 */
export type NarrowKey<KeyInput extends Key> = {
  [Property in keyof KeyInput]: KeyInput[Property]
}
