import type {
  ResolvedBinarySchema,
  ResolvedNumberSchema,
  ResolvedStringSchema
} from '~/schema/index.js'
import type { IndexNames, IndexSchema } from '~/table/actions/indexes.js'
import type { Table } from '~/table/index.js'
import type { GlobalIndex, IndexableKeyType, Key, LocalIndex } from '~/table/types/index.js'
import type { ResolveIndexableKeyType } from '~/table/types/keyType.js'
import type { ComputeDeep } from '~/types/compute.js'

type BeginsWithOperator = 'beginsWith'
type BetweenOperator = 'between'
type RangeOperator = 'gt' | 'gte' | 'lt' | 'lte'
type EqualityOperator = 'eq'
export type QueryOperator = EqualityOperator | RangeOperator | BeginsWithOperator | BetweenOperator

/**
 * @debt refactor "Factorize with Condition types"
 */
export type QueryRange<
  KEY_TYPE extends IndexableKeyType,
  KEY_VALUE extends
    | ResolvedNumberSchema
    | ResolvedStringSchema
    | ResolvedBinarySchema = ResolveIndexableKeyType<KEY_TYPE>
> =
  | (RangeOperator extends infer COMPARISON_OPERATOR
      ? COMPARISON_OPERATOR extends RangeOperator
        ? Record<COMPARISON_OPERATOR, KEY_VALUE>
        : never
      : never)
  | Record<BetweenOperator, [KEY_VALUE, KEY_VALUE]>
  | Record<EqualityOperator, KEY_VALUE>
  | (KEY_TYPE extends 'string' ? Record<BeginsWithOperator, KEY_VALUE> : never)

type SecondaryIndexQuery<
  TABLE extends Table,
  INDEX_NAME extends IndexNames<TABLE>,
  INDEX_SCHEMA extends IndexSchema<TABLE> = IndexSchema<TABLE, INDEX_NAME>
> = ComputeDeep<
  { index: INDEX_NAME } & (INDEX_SCHEMA extends GlobalIndex
    ? {
        partition: ResolveIndexableKeyType<INDEX_SCHEMA['partitionKey']['type']>
        range?: INDEX_SCHEMA['sortKey'] extends Key
          ? QueryRange<INDEX_SCHEMA['sortKey']['type']>
          : undefined
      }
    : INDEX_SCHEMA extends LocalIndex
      ? {
          partition: ResolveIndexableKeyType<TABLE['partitionKey']['type']>
          range?: QueryRange<INDEX_SCHEMA['sortKey']['type']>
        }
      : never)
>

type SecondaryIndexQueries<TABLE extends Table> =
  IndexNames<TABLE> extends infer INDEX_NAME
    ? INDEX_NAME extends IndexNames<TABLE>
      ? SecondaryIndexQuery<TABLE, INDEX_NAME>
      : never
    : never

type PrimaryIndexQuery<TABLE extends Table> = ComputeDeep<
  { index?: never } & (Key extends TABLE['sortKey']
    ? {
        partition: ResolveIndexableKeyType<TABLE['partitionKey']['type']>
        range?: never
      }
    : {
        partition: ResolveIndexableKeyType<TABLE['partitionKey']['type']>
        range?: QueryRange<NonNullable<TABLE['sortKey']>['type']>
      })
>

export type Query<TABLE extends Table> = PrimaryIndexQuery<TABLE> | SecondaryIndexQueries<TABLE>
