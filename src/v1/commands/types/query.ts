import type { A } from 'ts-toolbelt'
import type { PrimitiveAttribute, ResolvePrimitiveAttribute } from 'v1/schema'
import type { IndexableKeyType, TableV2 } from 'v1/table'
import type { LocalIndex, GlobalIndex, IndexNames, IndexSchema, Key } from 'v1/table'

// TODO: Factorize with Condition
type QueryRange<
  KEY_TYPE extends IndexableKeyType,
  ATTRIBUTE_VALUE extends ResolvePrimitiveAttribute<
    PrimitiveAttribute<KEY_TYPE>
  > = ResolvePrimitiveAttribute<PrimitiveAttribute<KEY_TYPE>>
> =
  | { lt: ATTRIBUTE_VALUE }
  | { lte: ATTRIBUTE_VALUE }
  | { gt: ATTRIBUTE_VALUE }
  | { gte: ATTRIBUTE_VALUE }
  | { between: [ATTRIBUTE_VALUE, ATTRIBUTE_VALUE] }

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
        range: QueryRange<INDEX_SCHEMA['sortKey']['type']>
      }
    : INDEX_SCHEMA extends LocalIndex
    ? {
        partition: ResolvePrimitiveAttribute<PrimitiveAttribute<TABLE['partitionKey']['type']>>
        range: QueryRange<INDEX_SCHEMA['sortKey']['type']>
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
        range: QueryRange<NonNullable<TABLE['sortKey']>['type']>
      }
    : never)
>

export type Query<TABLE extends TableV2> = PrimaryIndexQuery<TABLE> | SecondaryIndexQueries<TABLE>
