import type { A } from 'ts-toolbelt'

import { GetItemCommand } from '~/entity/actions/get/index.js'
import type { GetItemOptions, GetItemResponse } from '~/entity/actions/get/index.js'
import type { KeyInputItem } from '~/entity/index.js'

import type { AwsError, Error } from './actionStub.js'
import { TestEntity } from './spy.fixtures.test.js'
import { EntitySpy } from './spy.js'

const spy = TestEntity.build(EntitySpy)

const stub = spy.on(GetItemCommand)

const assertReject: A.Equals<
  (typeof stub)['reject'],
  (error?: string | Error | AwsError | undefined) => typeof spy
> = 1
assertReject

const assertResolve: A.Equals<
  (typeof stub)['resolve'],
  (resp: GetItemResponse<typeof TestEntity>) => typeof spy
> = 1
assertResolve

const assertMock: A.Equals<
  (typeof stub)['mock'],
  (
    mock: (
      arg: KeyInputItem<typeof TestEntity>,
      options: GetItemOptions<typeof TestEntity>
    ) =>
      | Promise<GetItemResponse<typeof TestEntity>>
      | GetItemResponse<typeof TestEntity>
      | undefined
  ) => typeof spy
> = 1
assertMock

const assertReset: A.Equals<(typeof spy)['reset'], () => typeof spy> = 1
assertReset

const assertRestore: A.Equals<(typeof spy)['restore'], () => void> = 1
assertRestore

const sent = spy.sent(GetItemCommand)

const assertCount: A.Equals<(typeof sent)['count'], () => number> = 1
assertCount

const assertArgs: A.Equals<
  (typeof sent)['args'],
  (at: number) => [KeyInputItem<typeof TestEntity>, GetItemOptions<typeof TestEntity>] | undefined
> = 1
assertArgs

const assertAllArgs: A.Equals<
  (typeof sent)['allArgs'],
  () => [KeyInputItem<typeof TestEntity>, GetItemOptions<typeof TestEntity>][]
> = 1
assertAllArgs
