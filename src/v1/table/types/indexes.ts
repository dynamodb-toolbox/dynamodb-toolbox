import type { Key } from './key'

/**
 * Define an index of a Table
 *
 * @param KEY_NAME Key attribute name
 * @param KEY_TYPE Key value type
 * @return Key
 */
export type Index =
  | { type: 'local'; partitionKey?: undefined; sortKey: Key }
  | { type: 'global'; partitionKey: Key; sortKey: Key }
