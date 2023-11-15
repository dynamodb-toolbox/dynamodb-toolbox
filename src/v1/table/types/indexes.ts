import type { Key } from './key'

export interface LocalIndex {
  type: 'local'
  partitionKey?: undefined
  sortKey: Key
}

export interface GlobalIndex {
  type: 'global'
  partitionKey: Key
  sortKey: Key
}

/**
 * Define an index of a Table
 *
 * @param KEY_NAME Key attribute name
 * @param KEY_TYPE Key value type
 * @return Key
 */
export type Index = LocalIndex | GlobalIndex
