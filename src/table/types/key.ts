/**
 * Possible Table Key or Index attribute type
 */
export type KeyType = 'string' | 'binary' | 'number'

/**
 * Define a partition or sort key of a Table or Table index
 *
 * @param KEY_NAME Key attribute name
 * @param KEY_TYPE Key value type
 * @return Key
 */
export interface Key<KEY_NAME extends string = string, KEY_TYPE extends KeyType = KeyType> {
  name: KEY_NAME
  type: KEY_TYPE
}

export type KeyTypeValue<KEY_TYPE extends KeyType> =
  | (KEY_TYPE extends 'string' ? string : never)
  | (KEY_TYPE extends 'number' ? number | bigint : never)
  | (KEY_TYPE extends 'binary' ? Uint8Array : never)

export type KeyValue<KEY extends Key = Key> = KeyTypeValue<KEY['type']>
