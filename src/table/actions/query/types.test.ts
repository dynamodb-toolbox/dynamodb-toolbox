import type { A } from 'ts-toolbelt'

import type {
  GlobalSecondaryIndexQuery,
  LocalSecondaryIndexQuery,
  PrimaryIndexQuery,
  Query,
  SecondaryIndexQuery
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

type KeyValue = string | number | bigint | Uint8Array

type ExpectedLocalSecondaryIndexQuery = {
  index: string
  partition: KeyValue
  range?: AnyRange
}

const assertLocalSecondaryIndex: A.Equals<
  LocalSecondaryIndexQuery,
  ExpectedLocalSecondaryIndexQuery
> = 1
assertLocalSecondaryIndex

type ExpectedGlobalSecondaryIndexQuery = {
  index: string
  partition: KeyValue | KeyValue[]
  range?: AnyRange | (KeyValue | AnyRange)[]
}

const assertGlobalSecondaryIndex: A.Equals<
  GlobalSecondaryIndexQuery,
  ExpectedGlobalSecondaryIndexQuery
> = 1
assertGlobalSecondaryIndex

const assertQuery: A.Equals<Query, PrimaryIndexQuery | SecondaryIndexQuery> = 1
assertQuery
