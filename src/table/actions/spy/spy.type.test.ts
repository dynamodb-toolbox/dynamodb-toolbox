import type { A } from 'ts-toolbelt'

import type { Entity } from '~/entity/index.js'
import { QueryCommand } from '~/table/actions/query/index'
import type { Query, QueryOptions, QueryResponse } from '~/table/actions/query/index'

import type { AwsError, Error } from './actionStub.js'
import { TestTable } from './spy.fixtures.test.js'
import { TableSpy } from './spy.js'

const spy = TestTable.build(TableSpy)

const stub = spy.on(QueryCommand)

const assertReject: A.Equals<
  (typeof stub)['reject'],
  (error?: string | Error | AwsError | undefined) => typeof spy
> = 1
assertReject

const assertResolve: A.Equals<
  (typeof stub)['resolve'],
  (
    resp: QueryResponse<
      typeof TestTable,
      Query<typeof TestTable>,
      Entity[],
      QueryOptions<typeof TestTable, Entity[], Query<typeof TestTable>>
    >
  ) => typeof spy
> = 1
assertResolve

const assertMock: A.Equals<
  (typeof stub)['mock'],
  (
    mock: (
      entities: Entity[],
      query: Query<typeof TestTable>,
      options: QueryOptions<typeof TestTable, Entity[], Query<typeof TestTable>>
    ) =>
      | Promise<
          QueryResponse<
            typeof TestTable,
            Query<typeof TestTable>,
            Entity[],
            QueryOptions<typeof TestTable, Entity[], Query<typeof TestTable>>
          >
        >
      | QueryResponse<
          typeof TestTable,
          Query<typeof TestTable>,
          Entity[],
          QueryOptions<typeof TestTable, Entity[], Query<typeof TestTable>>
        >
      | undefined
  ) => typeof spy
> = 1
assertMock

const assertReset: A.Equals<(typeof spy)['reset'], () => typeof spy> = 1
assertReset

const assertRestore: A.Equals<(typeof spy)['restore'], () => void> = 1
assertRestore

const sent = spy.sent(QueryCommand)

const assertCount: A.Equals<(typeof sent)['count'], () => number> = 1
assertCount

const assertArgs: A.Equals<
  (typeof sent)['args'],
  (
    at: number
  ) =>
    | [
        entities: Entity[],
        query: Query<typeof TestTable>,
        options: QueryOptions<typeof TestTable, Entity[], Query<typeof TestTable>>
      ]
    | undefined
> = 1
assertArgs

const assertAllArgs: A.Equals<
  (typeof sent)['allArgs'],
  () => [
    entities: Entity[],
    query: Query<typeof TestTable>,
    options: QueryOptions<typeof TestTable, Entity[], Query<typeof TestTable>>
  ][]
> = 1
assertAllArgs
