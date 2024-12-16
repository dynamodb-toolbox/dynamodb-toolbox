import type { __MetadataBearer } from '@aws-sdk/client-dynamodb'
import { QueryCommand as _QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { AwsStub } from 'aws-sdk-client-mock'
import { mockClient } from 'aws-sdk-client-mock'

import type { FormattedItem, SavedItem } from '~/index.js'
import { QueryCommand } from '~/table/actions/query/index.js'

import { TestEntity, TestTable, documentClient } from './spy.fixtures.test.js'
import { TableSpy } from './spy.js'

let documentClientMock: AwsStub<object, __MetadataBearer, unknown>

const formattedItem: FormattedItem<typeof TestEntity> = {
  email: 'some@email.com',
  sort: 'abc',
  test: 'this-is-a-test',
  created: '2020-01-01T00:00:00.000Z',
  modified: '2020-01-01T00:00:00.000Z'
}

const savedItem: SavedItem<typeof TestEntity> = {
  pk: 'some@email.com',
  sk: 'abc',
  test: 'this-is-a-test',
  _et: 'TestEntity',
  _ct: '2020-01-01T00:00:00.000Z',
  _md: '2020-01-01T00:00:00.000Z'
}

describe('table spy', () => {
  beforeAll(() => {
    documentClientMock = mockClient(documentClient)
  })

  afterAll(() => {
    documentClientMock.restore()
  })

  beforeEach(() => {
    documentClientMock.reset()
  })

  test('it mocks a sendable action (GetItemCommand) and restores it', async () => {
    const spy = TestTable.build(TableSpy)

    spy.on(QueryCommand).resolve({ Items: [formattedItem] })

    const query = { partition: 'some@email.com', range: { gte: 'b' } }
    const options = { consistent: true }
    const args = [[TestEntity], query, options]

    const { Items: receivedItems } = await TestTable.build(QueryCommand)
      .entities(TestEntity)
      .query(query)
      .options(options)
      .send()

    const sentQueryCommands = spy.sent(QueryCommand)
    expect(sentQueryCommands.count()).toBe(1)
    expect(sentQueryCommands.args(0)).toStrictEqual(args)
    expect(sentQueryCommands.allArgs()).toStrictEqual([args])

    expect(receivedItems).toStrictEqual([formattedItem])

    expect(documentClientMock.commandCalls(_QueryCommand)).toHaveLength(0)

    spy.reset()
    expect(sentQueryCommands.count()).toBe(0)
    expect(sentQueryCommands.args(0)).toBeUndefined()
    expect(sentQueryCommands.allArgs()).toStrictEqual([])

    spy.restore()

    documentClientMock.on(_QueryCommand).resolves({ Items: [savedItem] })
    await TestTable.build(QueryCommand).entities(TestEntity).query(query).options(options).send()

    expect(documentClientMock.commandCalls(_QueryCommand)).toHaveLength(1)
  })
})
