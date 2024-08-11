import type { PrimitiveAttribute, ResolvePrimitiveAttribute } from '~/attributes/index.js'
import type {
  BeginsWithOperator,
  BetweenOperator,
  EqualityOperator,
  RangeOperator
} from '~/schema/actions/parseCondition/index.js'
import type { IndexNames, IndexSchema } from '~/table/actions/indexes.js'
import type { Table } from '~/table/index.js'
import type { GlobalIndex, IndexableKeyType, Key, LocalIndex } from '~/table/types/index.js'
import type { ComputeDeep } from '~/types/compute.js'

type QueryOperator = EqualityOperator | RangeOperator | BeginsWithOperator | BetweenOperator
export const queryOperatorSet = new Set<QueryOperator>([
  'eq',
  'gt',
  'gte',
  'lt',
  'lte',
  'between',
  'beginsWith'
])

/**
 * @debt refactor "Factorize with Condition types"
 */
type QueryRange<
  KEY_TYPE extends IndexableKeyType,
  ATTRIBUTE_VALUE extends ResolvePrimitiveAttribute<
    PrimitiveAttribute<KEY_TYPE>
  > = ResolvePrimitiveAttribute<PrimitiveAttribute<KEY_TYPE>>
> =
  | (RangeOperator extends infer COMPARISON_OPERATOR
      ? COMPARISON_OPERATOR extends RangeOperator
        ? Record<COMPARISON_OPERATOR, ATTRIBUTE_VALUE>
        : never
      : never)
  | Record<BetweenOperator, [ATTRIBUTE_VALUE, ATTRIBUTE_VALUE]>
  | Record<EqualityOperator, ATTRIBUTE_VALUE>
  | (KEY_TYPE extends 'string' ? Record<BeginsWithOperator, ATTRIBUTE_VALUE> : never)

type SecondaryIndexQuery<
  TABLE extends Table,
  INDEX_NAME extends IndexNames<TABLE>,
  INDEX_SCHEMA extends IndexSchema<TABLE> = IndexSchema<TABLE, INDEX_NAME>
> = ComputeDeep<
  { index: INDEX_NAME } & (INDEX_SCHEMA extends GlobalIndex
    ? {
        partition: ResolvePrimitiveAttribute<
          PrimitiveAttribute<INDEX_SCHEMA['partitionKey']['type']>
        >
        range?: INDEX_SCHEMA['sortKey'] extends Key
          ? QueryRange<INDEX_SCHEMA['sortKey']['type']>
          : undefined
      }
    : INDEX_SCHEMA extends LocalIndex
      ? {
          partition: ResolvePrimitiveAttribute<PrimitiveAttribute<TABLE['partitionKey']['type']>>
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
  {
    index?: never
  } & (Key extends TABLE['sortKey']
    ? {
        partition: ResolvePrimitiveAttribute<PrimitiveAttribute<TABLE['partitionKey']['type']>>
        range?: never
      }
    : NonNullable<TABLE['sortKey']> extends Key
      ? {
          partition: ResolvePrimitiveAttribute<PrimitiveAttribute<TABLE['partitionKey']['type']>>
          range?: QueryRange<NonNullable<TABLE['sortKey']>['type']>
        }
      : never)
>

export type Query<TABLE extends Table> = PrimaryIndexQuery<TABLE> | SecondaryIndexQueries<TABLE>
