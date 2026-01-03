import type {
  ResolvedBinarySchema,
  ResolvedNumberSchema,
  ResolvedStringSchema
} from '~/schema/index.js'
import type { IndexNames, IndexSchema } from '~/table/actions/indexes.js'
import type { Table } from '~/table/index.js'
import type {
  GlobalIndex as GlobalSecondaryIndex,
  Key,
  KeyType,
  KeyTypeValue,
  KeyValue,
  LocalIndex as LocalSecondaryIndex
} from '~/table/types/index.js'

export type Query<TABLE extends Table = Table> =
  | PrimaryIndexQuery<TABLE>
  | SecondaryIndexQueries<TABLE>

// --- PRIMARY ---
export type PrimaryIndexQuery<TABLE extends Table = Table> = {
  index?: undefined
  partition: KeyValue<TABLE['partitionKey']>
  range?: QueryRange<NonNullable<TABLE['sortKey']>>
}

// --- RANGE ---
/**
 * @debt refactor "Factorize with Condition types"
 */
type BeginsWithOperator = 'beginsWith'
type BetweenOperator = 'between'
type RangeOperator = 'gt' | 'gte' | 'lt' | 'lte'
type EqualityOperator = 'eq'
export type QueryOperator = EqualityOperator | RangeOperator | BeginsWithOperator | BetweenOperator

type KeyRange<
  KEY_VALUE extends ResolvedNumberSchema | ResolvedStringSchema | ResolvedBinarySchema
> =
  | (RangeOperator extends infer COMPARISON_OPERATOR
      ? COMPARISON_OPERATOR extends RangeOperator
        ? { [KEY in COMPARISON_OPERATOR]: KEY_VALUE }
        : never
      : never)
  | { [KEY in BetweenOperator]: [KEY_VALUE, KEY_VALUE] }
  | { [KEY in EqualityOperator]: KEY_VALUE }

type QueryTypeRange<KEY_TYPE extends KeyType> =
  | (KEY_TYPE extends 'string'
      ?
          | { [OPERATOR in BeginsWithOperator]: KeyTypeValue<KEY_TYPE> }
          | KeyRange<KeyTypeValue<KEY_TYPE>>
      : never)
  | (KEY_TYPE extends 'number' ? KeyRange<KeyTypeValue<KEY_TYPE>> : never)
  | (KEY_TYPE extends 'binary' ? KeyRange<KeyTypeValue<KEY_TYPE>> : never)

export type QueryRange<KEY extends Key = Key> = QueryTypeRange<KEY['type']>

// --- SECONDARY ---
export type SecondaryIndexQueries<TABLE extends Table = Table> = {
  [INDEX_NAME in IndexNames<TABLE>]: SecondaryIndexQuery<TABLE, INDEX_NAME>
}[IndexNames<TABLE>]

export type SecondaryIndexQuery<
  TABLE extends Table = Table,
  INDEX_NAME extends IndexNames<TABLE> = IndexNames<TABLE>,
  INDEX_SCHEMA extends IndexSchema<TABLE, INDEX_NAME> = IndexSchema<TABLE, INDEX_NAME>
> =
  | (INDEX_SCHEMA extends LocalSecondaryIndex
      ? LocalSecondaryIndexQuery<TABLE, INDEX_NAME, INDEX_SCHEMA>
      : never)
  | (INDEX_SCHEMA extends GlobalSecondaryIndex
      ? GlobalSecondaryIndexQuery<INDEX_NAME, INDEX_SCHEMA>
      : never)

// --- SECONDARY: LOCAL ---
export type LocalSecondaryIndexQuery<
  TABLE extends Table = Table,
  INDEX_NAME extends string = string,
  INDEX_SCHEMA extends LocalSecondaryIndex = LocalSecondaryIndex
> = {
  index: INDEX_NAME
  partition: KeyValue<TABLE['partitionKey']>
  range?: QueryRange<INDEX_SCHEMA['sortKey']>
}

// --- SECONDARY: GLOBAL ---
export type GlobalSecondaryIndexQuery<
  INDEX_NAME extends string = string,
  INDEX_SCHEMA extends GlobalSecondaryIndex = GlobalSecondaryIndex
> = {
  index: INDEX_NAME
  partition:
    | (INDEX_SCHEMA extends { readonly partitionKey: Key }
        ? KeyValue<INDEX_SCHEMA['partitionKey']>
        : never)
    | (INDEX_SCHEMA extends { readonly partitionKeys: readonly Key[] }
        ? KeyValueRec<INDEX_SCHEMA['partitionKeys']>
        : never)
  range?:
    | (INDEX_SCHEMA extends { readonly sortKey?: Key }
        ? QueryRange<NonNullable<INDEX_SCHEMA['sortKey']>>
        : never)
    | (INDEX_SCHEMA extends { readonly sortKeys?: readonly Key[] }
        ? QueryRangeRec<NonNullable<INDEX_SCHEMA['sortKeys']>>
        : never)
}

type KeyValueRec<KEYS extends readonly Key[], KEY_VALUES extends KeyValue[] = []> = KEYS extends [
  infer KEYS_HEAD,
  ...infer KEYS_TAIL
]
  ? KEYS_TAIL extends readonly Key[]
    ? KEYS_HEAD extends Key
      ? KeyValueRec<KEYS_TAIL, [...KEY_VALUES, KeyValue<KEYS_HEAD>]>
      : never
    : never
  : number extends KEYS['length']
    ? KeyValue<KEYS[number]>[]
    : KEY_VALUES

type QueryRangeRec<
  KEYS extends readonly Key[],
  PREV_KEY_VALUES extends KeyValue[] = [],
  QUERY_RANGES extends (KeyValue | QueryRange)[] = []
> = KEYS extends [infer KEYS_HEAD, ...infer KEYS_TAIL]
  ? KEYS_TAIL extends readonly Key[]
    ? KEYS_HEAD extends Key
      ? QueryRangeRec<
          KEYS_TAIL,
          [...PREV_KEY_VALUES, KeyValue<KEYS_HEAD>],
          QUERY_RANGES | [...PREV_KEY_VALUES, KeyValue<KEYS_HEAD> | QueryRange<KEYS_HEAD>]
        >
      : never
    : never
  : number extends KEYS['length']
    ? (KeyValue<KEYS[number]> | QueryRange<KEYS[number]>)[]
    : QUERY_RANGES
