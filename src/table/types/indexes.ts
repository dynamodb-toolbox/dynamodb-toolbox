import type { Key } from './key.js'

/** A local secondary index, sharing the table partition key and adding its own sort key. */
export interface LocalIndex {
  readonly type: 'local'
  readonly partitionKey?: undefined
  readonly sortKey: Key
}

type GlobalIndexPartitionKey =
  | { readonly partitionKey: Key; readonly partitionKeys?: never }
  | { readonly partitionKey?: never; readonly partitionKeys: readonly Key[] }

type GlobalIndexSortKey =
  | { readonly sortKey?: Key; readonly sortKeys?: never }
  | { readonly sortKey?: never; readonly sortKeys?: readonly Key[] }

/** A global secondary index, with its own partition key(s) and optional sort key(s). */
export type GlobalIndex = { readonly type: 'global' } & GlobalIndexPartitionKey & GlobalIndexSortKey

/**
 * Define an index of a Table
 *
 * @param KEY_NAME Key attribute name
 * @param KEY_TYPE Key value type
 * @return Key
 */
export type Index = LocalIndex | GlobalIndex
