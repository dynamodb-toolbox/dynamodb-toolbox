import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import type { __MetadataBearer } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand as _QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { AwsStub } from 'aws-sdk-client-mock'
import { mockClient } from 'aws-sdk-client-mock'
import MockDate from 'mockdate'
import type { A } from 'ts-toolbelt'

import type { FormattedItem, SavedItem } from '~/index.js'
import { DynamoDBToolboxError, Entity, Table, TableSpy, item, number, string } from '~/index.js'

import { $entity } from './constants.js'
import { QueryCommand } from './queryCommand.js'
import type { IQueryCommand } from './queryCommand.js'

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
    skA: string().key().savedAs('sk'),
    name: string()
  }),
  table: TestTable
})
const incompleteSavedItemA: Omit<SavedItem<typeof EntityA>, '_et'> = {
  _ct: '2021-09-01T00:00:00.000Z',
  _md: '2021-09-01T00:00:00.000Z',
  pk: 'a',
  sk: 'a',
  name: 'foo'
}
const completeSavedItemA: SavedItem<typeof EntityA> = {
  ...incompleteSavedItemA,
  _et: 'EntityA'
}
const formattedItemA: FormattedItem<typeof EntityA> = {
  created: '2021-09-01T00:00:00.000Z',
  modified: '2021-09-01T00:00:00.000Z',
  pkA: 'a',
  skA: 'a',
  name: 'foo'
}

const EntityB = new Entity({
  name: 'EntityB',
  schema: item({
    pkB: string().key().savedAs('pk'),
    skB: string().key().savedAs('sk'),
    age: number()
  }),
  table: TestTable
})
const incompleteSavedItemB: Omit<SavedItem<typeof EntityB>, '_et'> = {
  _ct: '2021-09-01T00:00:00.000Z',
  _md: '2021-09-01T00:00:00.000Z',
  pk: 'b',
  sk: 'b',
  age: 42
}
const completeSavedItemB: SavedItem<typeof EntityB> = {
  ...incompleteSavedItemB,
  _et: 'EntityB'
}
const formattedItemB: FormattedItem<typeof EntityB> = {
  created: '2021-09-01T00:00:00.000Z',
  modified: '2021-09-01T00:00:00.000Z',
  pkB: 'b',
  skB: 'b',
  age: 42
}

const invalidItem = {
  pk: 'c',
  sk: 'c'
}

describe('queryCommand', () => {
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

  test('uses entityAttribute for formatting if is provided (even with entityAttrFilter set to false)', async () => {
    documentClientMock.on(_QueryCommand).resolves({
      Items: [completeSavedItemA, completeSavedItemB]
    })

    const cmd = TestTable.build(QueryCommand)
      .entities(EntityA, EntityB)
      .query({ partition: 'a' })
      .options({ entityAttrFilter: false })

    const assertExtends: A.Extends<typeof cmd, IQueryCommand> = 1
    assertExtends

    const { Items } = await cmd.send()

    expect(Items).toStrictEqual([formattedItemA, formattedItemB])
  })

  test('appends entityAttribute if showEntityAttr is true', async () => {
    documentClientMock.on(_QueryCommand).resolves({
      Items: [completeSavedItemA, completeSavedItemB]
    })

    const { Items } = await TestTable.build(QueryCommand)
      .entities(EntityA, EntityB)
      .query({ partition: 'a' })
      .options({ showEntityAttr: true })
      .send()

    expect(Items).toStrictEqual([
      { entity: EntityA.entityName, ...formattedItemA },
      { entity: EntityB.entityName, ...formattedItemB }
    ])
  })

  test('appends $entity symbol if tagEntities is true', async () => {
    documentClientMock.on(_QueryCommand).resolves({
      Items: [completeSavedItemA, completeSavedItemB]
    })

    const { Items } = await TestTable.build(QueryCommand)
      .entities(EntityA, EntityB)
      .query({ partition: 'a' })
      .options({ tagEntities: true })
      .send()

    expect(Items).toStrictEqual([
      { [$entity]: EntityA.entityName, ...formattedItemA },
      { [$entity]: EntityB.entityName, ...formattedItemB }
    ])
  })

  test('tries all formatters if entityAttribute misses and throws on invalid items if noEntityMatchBehavior is "THROW" (default)', async () => {
    documentClientMock.on(_QueryCommand).resolves({
      Items: [incompleteSavedItemA, incompleteSavedItemB, invalidItem]
    })

    const invalidCall = async () =>
      await TestTable.build(QueryCommand)
        .entities(EntityA, EntityB)
        .query({ partition: 'a' })
        .options({ entityAttrFilter: false })
        .send()

    expect(invalidCall).rejects.toThrow(DynamoDBToolboxError)
    expect(invalidCall).rejects.toThrow(
      expect.objectContaining({ code: 'queryCommand.noEntityMatched' })
    )
  })

  test('tries all formatters if entityAttribute misses and omit invalid items if noEntityMatchBehavior is "DISCARD"', async () => {
    documentClientMock.on(_QueryCommand).resolves({
      Items: [incompleteSavedItemA, incompleteSavedItemB, invalidItem]
    })

    const { Items } = await TestTable.build(QueryCommand)
      .entities(EntityA, EntityB)
      .query({ partition: 'a' })
      .options({ entityAttrFilter: false, noEntityMatchBehavior: 'DISCARD' })
      .send()

    expect(Items).toStrictEqual([formattedItemA, formattedItemB])
  })

  describe('paginate', () => {
    const key1 = { pk: 'a', sk: 'a' }
    const key2 = { pk: 'b', sk: 'b' }

    test('yields one batch per DDB page until LastEvaluatedKey is exhausted (last batch included)', async () => {
      documentClientMock
        .on(_QueryCommand)
        .resolvesOnce({ Items: [completeSavedItemA], LastEvaluatedKey: key1 })
        .resolvesOnce({ Items: [completeSavedItemB], LastEvaluatedKey: key2 })
        .resolves({ Items: [completeSavedItemA] })

      const cmd = TestTable.build(QueryCommand).entities(EntityA, EntityB).query({ partition: 'a' })

      const batches = []
      for await (const page of cmd.paginate()) {
        const assertPage: A.Equals<typeof page, Awaited<ReturnType<typeof cmd.send>>> = 1
        assertPage

        batches.push(page)
      }

      expect(batches).toHaveLength(3)
      expect(batches).toStrictEqual([
        { Items: [formattedItemA], LastEvaluatedKey: key1 },
        { Items: [formattedItemB], LastEvaluatedKey: key2 },
        { Items: [formattedItemA] }
      ])

      const calls = documentClientMock.commandCalls(_QueryCommand)
      expect(calls).toHaveLength(3)
      expect(calls[0]?.args[0].input.ExclusiveStartKey).toBeUndefined()
      expect(calls[1]?.args[0].input.ExclusiveStartKey).toStrictEqual(key1)
      expect(calls[2]?.args[0].input.ExclusiveStartKey).toStrictEqual(key2)
    })

    test('accumulates maxPages DDB pages per yielded batch (two-level pagination)', async () => {
      documentClientMock
        .on(_QueryCommand)
        .resolvesOnce({ Items: [completeSavedItemA], LastEvaluatedKey: key1 })
        .resolvesOnce({ Items: [completeSavedItemA], LastEvaluatedKey: key1 })
        .resolvesOnce({ Items: [completeSavedItemA], LastEvaluatedKey: key2 })
        .resolvesOnce({ Items: [completeSavedItemA], LastEvaluatedKey: key2 })
        .resolves({ Items: [completeSavedItemA] })

      const cmd = TestTable.build(QueryCommand)
        .entities(EntityA, EntityB)
        .query({ partition: 'a' })
        .options({ maxPages: 2 })

      const batches = []
      for await (const page of cmd.paginate()) {
        batches.push(page)
      }

      expect(batches).toHaveLength(3)
      expect(batches).toStrictEqual([
        { Items: [formattedItemA, formattedItemA], LastEvaluatedKey: key1 },
        { Items: [formattedItemA, formattedItemA], LastEvaluatedKey: key2 },
        { Items: [formattedItemA] }
      ])

      expect(documentClientMock.commandCalls(_QueryCommand)).toHaveLength(5)
    })

    test('honors an initial exclusiveStartKey (resume) on the first batch', async () => {
      documentClientMock.on(_QueryCommand).resolves({ Items: [completeSavedItemA] })

      const cmd = TestTable.build(QueryCommand)
        .entities(EntityA, EntityB)
        .query({ partition: 'a' })
        .options({ exclusiveStartKey: key1 })

      for await (const page of cmd.paginate()) {
        expect(page.Items).toStrictEqual([formattedItemA])
      }

      const calls = documentClientMock.commandCalls(_QueryCommand)
      expect(calls[0]?.args[0].input.ExclusiveStartKey).toStrictEqual(key1)
    })

    test('reuses the spy path (one intercepted send per yielded batch)', async () => {
      const spy = TestTable.build(TableSpy)
      spy.on(QueryCommand).resolve({ Items: [formattedItemA] })

      try {
        const cmd = TestTable.build(QueryCommand)
          .entities(EntityA, EntityB)
          .query({ partition: 'a' })

        const batches = []
        for await (const page of cmd.paginate()) {
          batches.push(page)
        }

        expect(batches).toHaveLength(1)
        expect(batches[0]?.Items).toStrictEqual([formattedItemA])
        expect(spy.sent(QueryCommand).count()).toBe(1)
        // Spy short-circuits send, so no DDB call is made
        expect(documentClientMock.commandCalls(_QueryCommand)).toHaveLength(0)
      } finally {
        spy.restore()
      }
    })
  })
})
