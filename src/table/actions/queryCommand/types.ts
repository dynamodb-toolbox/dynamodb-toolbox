import type { A } from 'ts-toolbelt'

import type { PrimitiveAttribute, ResolvePrimitiveAttribute } from '~/schema/attributes/index.js'
import type { TableV2 } from '~/table/index.js'
import type { IndexableKeyType, LocalIndex, GlobalIndex, Key } from '~/table/types/index.js'
import type { IndexNames, IndexSchema } from '~/table/actions/indexes.js'
import type {
  RangeOperator,
  BeginsWithOperator,
  BetweenOperator
} from '~/schema/actions/parseCondition/index.js'

type QueryOperator = RangeOperator | BeginsWithOperator | BetweenOperator
export const queryOperatorSet = new Set<QueryOperator>([
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
  | (KEY_TYPE extends 'string' ? Record<BeginsWithOperator, ATTRIBUTE_VALUE> : never)

type SecondaryIndexQuery<
  TABLE extends TableV2,
  INDEX_NAME extends IndexNames<TABLE>,
  INDEX_SCHEMA extends IndexSchema<TABLE> = IndexSchema<TABLE, INDEX_NAME>
> = A.Compute<
  { index: INDEX_NAME } & (INDEX_SCHEMA extends GlobalIndex
    ? {
        partition: ResolvePrimitiveAttribute<
          PrimitiveAttribute<INDEX_SCHEMA['partitionKey']['type']>
        >
        range?: QueryRange<INDEX_SCHEMA['sortKey']['type']>
      }
    : INDEX_SCHEMA extends LocalIndex
    ? {
        partition: ResolvePrimitiveAttribute<PrimitiveAttribute<TABLE['partitionKey']['type']>>
        range?: QueryRange<INDEX_SCHEMA['sortKey']['type']>
      }
    : never)
>

type SecondaryIndexQueries<TABLE extends TableV2> = IndexNames<TABLE> extends infer INDEX_NAME
  ? INDEX_NAME extends IndexNames<TABLE>
    ? SecondaryIndexQuery<TABLE, INDEX_NAME>
    : never
  : never

type PrimaryIndexQuery<TABLE extends TableV2> = A.Compute<
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

export type Query<TABLE extends TableV2> = PrimaryIndexQuery<TABLE> | SecondaryIndexQueries<TABLE>
