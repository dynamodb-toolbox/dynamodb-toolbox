import type { A } from 'ts-toolbelt'

import type {
  GlobalSecondaryIndexQuery,
  LocalSecondaryIndexQuery,
  PrimaryIndexQuery,
  Query,
  SecondaryIndexQueries
} from './types.js'

type AnyRange =
  | { beginsWith: string }
  | { eq: string }
  | { eq: number | bigint }
  | { eq: Uint8Array }
  | { gt: string }
  | { gt: number | bigint }
  | { gt: Uint8Array }
  | { gte: string }
  | { gte: number | bigint }
  | { gte: Uint8Array }
  | { lt: string }
  | { lt: number | bigint }
  | { lt: Uint8Array }
  | { lte: string }
  | { lte: number | bigint }
  | { lte: Uint8Array }
  | { between: [string, string] }
  | { between: [number | bigint, number | bigint] }
  | { between: [Uint8Array, Uint8Array] }

type ExpectedPrimaryIndexQuery = {
  index?: undefined
  partition: string | number | bigint | Uint8Array
  range?: AnyRange
}

const assertPrimaryIndex: A.Equals<PrimaryIndexQuery, ExpectedPrimaryIndexQuery> = 1
assertPrimaryIndex

type ExpectedSecondaryIndexQuery = {
  index: string
  partition: string | number | bigint | Uint8Array
  range?: AnyRange
}

const assertLocalSecondaryIndex: A.Equals<LocalSecondaryIndexQuery, ExpectedSecondaryIndexQuery> = 1
assertLocalSecondaryIndex

const assertGlobalSecondaryIndex: A.Equals<GlobalSecondaryIndexQuery, ExpectedSecondaryIndexQuery> =
  1
assertGlobalSecondaryIndex

const assertSecondaryIndex: A.Equals<
  SecondaryIndexQueries,
  LocalSecondaryIndexQuery | GlobalSecondaryIndexQuery
> = 1
assertSecondaryIndex

const assertQuery: A.Equals<Query, ExpectedPrimaryIndexQuery | ExpectedSecondaryIndexQuery> = 1
assertQuery
