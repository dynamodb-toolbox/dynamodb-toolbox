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
    commonAttribute: string(),
    name: string()
  }),
  table: TestTable
})

const EntityB = new Entity({
  name: 'EntityB',
  schema: item({
    pkB: string().key().savedAs('pk'),
    skB: string().key().savedAs('sk'),
    commonAttribute: string(),
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
        // @ts-expect-error (NOTE: we have to use an attribute from the 2nd entity as the first is used to parse the paths)
        .options({ attributes: ['age'] })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )
  })

  test('parses projection expression', () => {
    const completeInput = TestTable.build(BatchGetCommand)
      .requests(EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }))
      .options({ attributes: ['entity', 'pkA', 'skA', 'commonAttribute'] })
      .params()

    expect(completeInput).toMatchObject({
      [TestTable.getName()]: {
        ProjectionExpression: '#p_1, #p_2, #p_3, #p_4',
        ExpressionAttributeNames: {
          '#p_1': '_et',
          '#p_2': 'pk',
          '#p_3': 'sk',
          '#p_4': 'commonAttribute'
        }
      }
    })
  })

  test('appends entityAttribute, pk and sk to projection expression', () => {
    const completeInput = TestTable.build(BatchGetCommand)
      .requests(EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' }))
      .options({ attributes: ['commonAttribute'] })
      .params()

    expect(completeInput).toMatchObject({
      [TestTable.getName()]: {
        ProjectionExpression: '#p_1, #p_2, #_pk, #_sk',
        ExpressionAttributeNames: {
          '#p_1': '_et',
          '#p_2': 'commonAttribute',
          '#_pk': TestTable.partitionKey.name,
          '#_sk': TestTable.sortKey?.name
        }
      }
    })
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
})
