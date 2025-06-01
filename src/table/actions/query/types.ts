import type {
  ResolvedBinarySchema,
  ResolvedNumberSchema,
  ResolvedStringSchema
} from '~/schema/index.js'
import type { IndexNames, IndexSchema } from '~/table/actions/indexes.js'
import type { Table } from '~/table/index.js'
import type { GlobalIndex, IndexableKeyType, Key, LocalIndex } from '~/table/types/index.js'
import type { ResolveIndexableKeyType } from '~/table/types/keyType.js'
import type { Extends, If, Not } from '~/types/index.js'

export type Query<TABLE extends Table = Table> =
  | PrimaryIndexQuery<TABLE>
  | SecondaryIndexQueries<TABLE>

export type PrimaryIndexQuery<TABLE extends Table = Table> = If<
  HasSortKey<{ partitionKey: TABLE['partitionKey']; sortKey?: TABLE['sortKey'] }>,
  {
    index?: undefined
    partition: ResolveIndexableKeyType<TABLE['partitionKey']['type']>
    range?: QueryRange<NonNullable<TABLE['sortKey']>['type']>
  },
  {
    index?: undefined
    partition: ResolveIndexableKeyType<TABLE['partitionKey']['type']>
    range?: never
  }
>

type SecondaryIndexQuery<
  TABLE extends Table,
  INDEX_NAME extends IndexNames<TABLE>,
  INDEX_SCHEMA extends IndexSchema<TABLE> = IndexSchema<TABLE, INDEX_NAME>
> = INDEX_SCHEMA extends GlobalIndex
  ? {
      index: INDEX_NAME
      partition: ResolveIndexableKeyType<INDEX_SCHEMA['partitionKey']['type']>
      range?: If<
        HasSortKey<{
          partitionKey: INDEX_SCHEMA['partitionKey']
          sortKey: INDEX_SCHEMA['sortKey']
        }>,
        QueryRange<NonNullable<INDEX_SCHEMA['sortKey']>['type']>,
        undefined
      >
    }
  : INDEX_SCHEMA extends LocalIndex
    ? {
        index: INDEX_NAME
        partition: ResolveIndexableKeyType<TABLE['partitionKey']['type']>
        range?: QueryRange<INDEX_SCHEMA['sortKey']['type']>
      }
    : never

// --- RANGE ---
type BeginsWithOperator = 'beginsWith'
type BetweenOperator = 'between'
type RangeOperator = 'gt' | 'gte' | 'lt' | 'lte'
type EqualityOperator = 'eq'
export type QueryOperator = EqualityOperator | RangeOperator | BeginsWithOperator | BetweenOperator

type IndexableKeyRange<
  KEY_VALUE extends ResolvedNumberSchema | ResolvedStringSchema | ResolvedBinarySchema
> =
  | (RangeOperator extends infer COMPARISON_OPERATOR
      ? COMPARISON_OPERATOR extends RangeOperator
        ? { [KEY in COMPARISON_OPERATOR]: KEY_VALUE }
        : never
      : never)
  | { [KEY in BetweenOperator]: [KEY_VALUE, KEY_VALUE] }
  | { [KEY in EqualityOperator]: KEY_VALUE }

/**
 * @debt refactor "Factorize with Condition types"
 */
export type QueryRange<KEY_TYPE extends IndexableKeyType> = KEY_TYPE extends 'string'
  ?
      | { [KEY in BeginsWithOperator]: ResolveIndexableKeyType<KEY_TYPE> }
      | IndexableKeyRange<ResolveIndexableKeyType<KEY_TYPE>>
  : IndexableKeyRange<ResolveIndexableKeyType<KEY_TYPE>>

export type SecondaryIndexQueries<TABLE extends Table = Table> =
  IndexNames<TABLE> extends infer INDEX_NAME
    ? INDEX_NAME extends IndexNames<TABLE>
      ? SecondaryIndexQuery<TABLE, INDEX_NAME>
      : never
    : never

// --- UTILS ---
type KeySchema = { partitionKey: Key; sortKey?: Key }

type HasSortKey<KEY_SCHEMA extends KeySchema> = KeySchema extends KEY_SCHEMA
  ? true
  : Not<Extends<string, NonNullable<KEY_SCHEMA['sortKey']>['name']>>
