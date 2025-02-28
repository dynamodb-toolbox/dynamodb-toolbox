import type { __MetadataBearer } from '@aws-sdk/client-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand as _GetCommand } from '@aws-sdk/lib-dynamodb'
import type { AwsStub } from 'aws-sdk-client-mock'
import { mockClient } from 'aws-sdk-client-mock'
import MockDate from 'mockdate'

import type { FormattedItem, SavedItem } from '~/index.js'
import { Entity, Table, item, string } from '~/index.js'

import { GetItemCommand } from './getItemCommand.js'

const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-1' })
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)
let documentClientMock: AwsStub<object, __MetadataBearer, unknown>

const TestTable = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const EntityA = new Entity({
  name: 'EntityA',
  schema: item({
    pkA: string().key().savedAs('pk'),
    skA: string().key().savedAs('sk')
  }),
  table: TestTable,
  timestamps: false
})
const incompleteSavedItemA: Omit<SavedItem<typeof EntityA>, '_et'> = {
  pk: 'a',
  sk: 'a'
}
const formattedItemA: FormattedItem<typeof EntityA> = {
  pkA: 'a',
  skA: 'a'
}

describe('getItemCommand', () => {
  beforeAll(() => {
    documentClientMock = mockClient(documentClient)
    MockDate.set(new Date())
  })

  afterAll(() => {
    documentClientMock.restore()
    MockDate.reset()
  })

  beforeEach(() => {
    documentClientMock.reset()
  })

  test('fills entity attribute if it misses', async () => {
    documentClientMock.on(_GetCommand).resolves({ Item: incompleteSavedItemA })

    const { Item } = await EntityA.build(GetItemCommand).key({ pkA: 'a', skA: 'a' }).send()

    expect(Item).toStrictEqual(formattedItemA)
  })
})
