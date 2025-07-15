import type { A } from 'ts-toolbelt'

import {
  BatchGetRequest,
  DynamoDBToolboxError,
  Entity,
  Table,
  item,
  number,
  string
} from '~/index.js'
import { $entities } from '~/table/index.js'

import { BatchGetCommand } from './batchGetCommand.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' }
})

const EntityA = new Entity({
  name: 'EntityA',
  schema: item({
    pkA: string().key().savedAs('pk'),
    skA: string().key().savedAs('sk'),
    name: string(),
    common: string()
  }),
  table: TestTable
})

const EntityB = new Entity({
  name: 'EntityB',
  schema: item({
    pkB: string().key().savedAs('pk'),
    skB: string().key().savedAs('sk'),
    common: string().savedAs('_c'),
    age: number()
  }),
  table: TestTable
})

describe('BatchGetCommand', () => {
  test('throws if there is no batchGetRequest', () => {
    const invalidCallA = () => TestTable.build(BatchGetCommand).params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))

    const invalidCallB = () => TestTable.build(BatchGetCommand).requests().params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  test('infers correct type when receiving a tuple of requests', () => {
    const command = TestTable.build(BatchGetCommand).requests(
      EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }),
      EntityB.build(BatchGetRequest).key({ pkB: 'b', skB: 'b' })
    )

    type AssertEntities = A.Equals<(typeof command)[$entities], [typeof EntityA, typeof EntityB]>
    const assertEntities: AssertEntities = 1
    assertEntities

    expect(command[$entities]).toStrictEqual([EntityA, EntityB])
  })

  test('infers correct type when receiving an array of requests', () => {
    const requests: [BatchGetRequest<typeof EntityA>, ...BatchGetRequest<typeof EntityB>[]] = [
      EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }),
      EntityB.build(BatchGetRequest).key({ pkB: 'b', skB: 'b' })
    ]

    const command = TestTable.build(BatchGetCommand).requests(...requests)

    // We have to do like this because order is not guaranteed
    type AssertEntitiesAB = A.Equals<(typeof command)[$entities], [typeof EntityA, typeof EntityB]>
    type AssertEntitiesBA = A.Equals<(typeof command)[$entities], [typeof EntityB, typeof EntityA]>
    const assertEntities: AssertEntitiesAB | AssertEntitiesBA = 1
    assertEntities

    expect(command[$entities]).toStrictEqual([EntityA, EntityB])
  })

  test('builds expected input', () => {
    const input = TestTable.build(BatchGetCommand)
      .requests(
        EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }),
        EntityB.build(BatchGetRequest).key({ pkB: 'b', skB: 'b' })
      )
      .params()

    expect(input).toStrictEqual({
      [TestTable.getName()]: {
        Keys: [
          { pk: 'a', sk: 'a' },
          { pk: 'b', sk: 'b' }
        ]
      }
    })
  })

  test('parses consistent options', () => {
    const command = TestTable.build(BatchGetCommand).requests(
      EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' })
    )

    const invalidCall = () =>
      command
        // @ts-expect-error
        .options({ consistent: 'true' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'options.invalidConsistentOption' })
    )

    const input = command.options({ consistent: true }).params()
    expect(input).toMatchObject({ [TestTable.getName()]: { ConsistentRead: true } })
  })

  test('parses attributes options', () => {
    const invalidCall = () =>
      TestTable.build(BatchGetCommand)
        .requests(
          EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }),
          EntityB.build(BatchGetRequest).key({ pkB: 'b', skB: 'b' })
        )
        .options({ attributes: ['age'] })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'batchGetCommand.invalidProjectionExpression' })
    )
  })

  test('parses projection expression', () => {
    const completeInput = TestTable.build(BatchGetCommand)
      .requests(EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }))
      .options({ attributes: ['entity', 'pkA', 'skA', 'name'] })
      .params()

    expect(completeInput).toMatchObject({
      [TestTable.getName()]: {
        ProjectionExpression: '#p_1, #p_2, #p_3, #p_4',
        ExpressionAttributeNames: {
          '#p_1': '_et',
          '#p_2': 'pk',
          '#p_3': 'sk',
          '#p_4': 'name'
        }
      }
    })
  })

  test('appends pk, sk and entityAttribute to projection expression if they miss', () => {
    const completeInput = TestTable.build(BatchGetCommand)
      .requests(EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }))
      .options({ attributes: ['name'] })
      .params()

    expect(completeInput).toMatchObject({
      [TestTable.getName()]: {
        ProjectionExpression: '#p_1, #_pk, #_sk, #_et',
        ExpressionAttributeNames: {
          '#p_1': 'name',
          '#_pk': TestTable.partitionKey.name,
          '#_sk': TestTable.sortKey?.name,
          '#_et': TestTable.entityAttributeSavedAs
        }
      }
    })
  })

  test('applies two entity projection expressions', () => {
    const completeInput = TestTable.build(BatchGetCommand)
      .requests(
        EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }),
        EntityB.build(BatchGetRequest).key({ pkB: 'b', skB: 'b' })
      )
      .options({ attributes: ['age', 'name', 'common'] })
      .params()

    expect(completeInput).toMatchObject({
      [TestTable.getName()]: {
        ProjectionExpression: '#p_1, #p_2, #p_3, #p_4, #_pk, #_sk, #_et',
        ExpressionAttributeNames: {
          '#p_1': 'name',
          '#p_2': 'common',
          '#p_3': 'age',
          '#p_4': '_c',
          '#_pk': TestTable.partitionKey.name,
          '#_sk': TestTable.sortKey?.name,
          '#_et': TestTable.entityAttributeSavedAs
        }
      }
    })
  })

  test('rejects projection expression if one entity has no match', () => {
    const command = TestTable.build(BatchGetCommand)
      .requests(
        EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }),
        EntityB.build(BatchGetRequest).key({ pkB: 'b', skB: 'b' })
      )
      .options({ attributes: ['age'] })

    const invalidCall = () => command.params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'batchGetCommand.invalidProjectionExpression' })
    )
  })

  test('parses tableName options', () => {
    const command = TestTable.build(BatchGetCommand).requests(
      EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' })
    )

    const invalidCall = () =>
      command
        // @ts-expect-error
        .options({ tableName: 42 })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidTableNameOption' }))

    const input = command.options({ tableName: 'tableName' }).params()
    expect(input).toMatchObject({ tableName: { Keys: [{ pk: 'a', sk: 'a' }] } })
  })

  test('updates options when using callback', () => {
    const input = TestTable.build(BatchGetCommand)
      .requests(EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }))
      .options({ consistent: true })
      .options(prevOptions => {
        const assertOptions: A.Equals<typeof prevOptions, { consistent: true }> = 1
        assertOptions

        return { ...prevOptions, tableName: 'tableName' }
      })
      .params()

    expect(input).toMatchObject({ tableName: { ConsistentRead: true } })
  })
})
