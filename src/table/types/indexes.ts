import type { Key } from './key.js'

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
 * Define an index of a table
 * @param KEY_NAME Key attribute name
 * @param KEY_TYPE Key value type
 * @returns Key
 */
export type Index = LocalIndex | GlobalIndex
