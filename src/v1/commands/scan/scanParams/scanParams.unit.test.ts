import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { A } from 'ts-toolbelt'

import {
  TableV2,
  DynamoDBToolboxError,
  ScanCommand,
  EntityV2,
  schema,
  string,
  number,
  Item,
  FormattedItem
} from 'v1'

const dynamoDbClient = new DynamoDBClient({})

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)

const TestTable = new TableV2({
  name: 'test-table',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  sortKey: {
    type: 'string',
    name: 'sk'
  },
  documentClient
})

const Entity1 = new EntityV2({
  name: 'entity1',
  schema: schema({
    userPoolId: string().key().savedAs('pk'),
    userId: string().key().savedAs('sk'),
    name: string(),
    age: number()
  }),
  table: TestTable
})

const Entity2 = new EntityV2({
  name: 'entity2',
  schema: schema({
    productGroupId: string().key().savedAs('pk'),
    productId: string().key().savedAs('sk'),
    launchDate: string(),
    price: number()
  }),
  table: TestTable
})

describe('scan', () => {
  it('gets the tableName', async () => {
    const command = TestTable.build(ScanCommand)
    const { TableName } = command.params()

    expect(TableName).toBe('test-table')

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      Item[] | undefined
    > = 1
    assertReturnedItems
  })

  // Options
  it('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestTable.build(ScanCommand)
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('fails on invalid capacity option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          capacity: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.invalidCapacityOption' }))
  })

  it('sets consistent option', () => {
    const { ConsistentRead } = TestTable.build(ScanCommand).options({ consistent: true }).params()

    expect(ConsistentRead).toBe(true)
  })

  it('fails on invalid consistent option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          consistent: 'true'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'commands.invalidConsistentOption' })
    )
  })

  it('sets exclusiveStartKey option', () => {
    const { ExclusiveStartKey } = TestTable.build(ScanCommand)
      .options({ exclusiveStartKey: { foo: 'bar' } })
      .params()

    expect(ExclusiveStartKey).toStrictEqual({ foo: 'bar' })
  })

  it('sets indexName option', () => {
    const { IndexName } = TestTable.build(ScanCommand).options({ indexName: 'GSI1' }).params()

    expect(IndexName).toBe('GSI1')
  })

  it('fails on invalid indexName option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          indexName: { foo: 'bar' }
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'commands.invalidIndexNameOption' })
    )
  })

  it('sets select option', () => {
    const { Select } = TestTable.build(ScanCommand).options({ select: 'COUNT' }).params()

    expect(Select).toBe('COUNT')
  })

  it('fails on invalid select option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          select: 'foobar'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSelectOption' })
    )
  })

  it('sets "ALL_PROJECTED_ATTRIBUTES" select option if an index is provided', () => {
    const { Select } = TestTable.build(ScanCommand)
      .options({ select: 'ALL_PROJECTED_ATTRIBUTES', indexName: 'my-index' })
      .params()

    expect(Select).toBe('ALL_PROJECTED_ATTRIBUTES')
  })

  it('fails if select option is "ALL_PROJECTED_ATTRIBUTES" but no index is provided', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        // @ts-expect-error
        .options({ select: 'ALL_PROJECTED_ATTRIBUTES' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSelectOption' })
    )
  })

  it('accepts "SPECIFIC_ATTRIBUTES" select option if a projection expression has been provided', () => {
    const { Select } = TestTable.build(ScanCommand)
      .entities(Entity1)
      .options({ attributes: ['age'], select: 'SPECIFIC_ATTRIBUTES' })
      .params()

    expect(Select).toBe('SPECIFIC_ATTRIBUTES')
  })

  it('fails if a projection expression has been provided but select option is NOT "SPECIFIC_ATTRIBUTES"', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .entities(Entity1)
        // @ts-expect-error
        .options({ attributes: { entity1: ['age'] }, select: 'ALL_ATTRIBUTES' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSelectOption' })
    )
  })

  it('sets limit option', () => {
    const { Limit } = TestTable.build(ScanCommand).options({ limit: 3 }).params()

    expect(Limit).toBe(3)
  })

  it('fails on invalid limit option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          limit: '3'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.invalidLimitOption' }))
  })

  it('sets segment and totalSegments options', () => {
    const { Segment, TotalSegments } = TestTable.build(ScanCommand)
      .options({ segment: 3, totalSegments: 4 })
      .params()

    expect(Segment).toBe(3)
    expect(TotalSegments).toBe(4)
  })

  it('fails on invalid segment and/or totalSegments options', () => {
    // segment without totalSegment option
    const invalidCallA = () =>
      TestTable.build(ScanCommand)
        // @ts-expect-error
        .options({ segment: 3 })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid totalSegments (non number)
    const invalidCallB = () =>
      TestTable.build(ScanCommand)
        .options({
          segment: 3,
          // @ts-expect-error
          totalSegments: 'foo'
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid totalSegments (non-integer)
    const invalidCallC = () =>
      TestTable.build(ScanCommand)
        // Impossible to raise type error here
        .options({ segment: 3, totalSegments: 3.5 })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid totalSegments (negative integer)
    const invalidCallD = () =>
      TestTable.build(ScanCommand)
        // Impossible to raise type error here
        .options({ segment: 3, totalSegments: -1 })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid segment (non-number)
    const invalidCallE = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          segment: 'foo',
          totalSegments: 4
        })
        .params()

    expect(invalidCallE).toThrow(DynamoDBToolboxError)
    expect(invalidCallE).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid segment (non-integer)
    const invalidCallF = () =>
      TestTable.build(ScanCommand)
        // Impossible to raise type error here
        .options({ segment: 2.5, totalSegments: 4 })
        .params()

    expect(invalidCallF).toThrow(DynamoDBToolboxError)
    expect(invalidCallF).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid segment (negative integer)
    const invalidCallG = () =>
      TestTable.build(ScanCommand)
        // Impossible to raise type error here
        .options({ segment: -1, totalSegments: 4 })
        .params()

    expect(invalidCallG).toThrow(DynamoDBToolboxError)
    expect(invalidCallG).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid segment (above totalSegments)
    const invalidCallH = () =>
      TestTable.build(ScanCommand)
        // Impossible to raise type error here
        .options({ segment: 3, totalSegments: 3 })
        .params()

    expect(invalidCallH).toThrow(DynamoDBToolboxError)
    expect(invalidCallH).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )
  })

  it('applies entity _et filter', () => {
    const command = TestTable.build(ScanCommand).entities(Entity1)
    const {
      FilterExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = command.params()

    expect(FilterExpression).toBe('#c0_1 = :c0_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#c0_1': TestTable.entityAttributeSavedAs })
    expect(ExpressionAttributeValues).toMatchObject({ ':c0_1': Entity1.name })

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      FormattedItem<typeof Entity1>[] | undefined
    > = 1
    assertReturnedItems
  })

  it('applies entity _et AND additional filter', () => {
    const {
      FilterExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestTable.build(ScanCommand)
      .entities(Entity1)
      .options({
        filters: {
          entity1: { attr: 'age', gte: 40 }
        }
      })
      .params()

    expect(FilterExpression).toBe('(#c0_1 = :c0_1) AND (#c0_2 >= :c0_2)')
    expect(ExpressionAttributeNames).toMatchObject({
      '#c0_1': TestTable.entityAttributeSavedAs,
      '#c0_2': 'age'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':c0_1': Entity1.name,
      ':c0_2': 40
    })
  })

  it('applies two entity filters', () => {
    const command = TestTable.build(ScanCommand).entities(Entity1, Entity2)
    const {
      FilterExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = command.params()

    expect(FilterExpression).toBe('(#c0_1 = :c0_1) OR (#c1_1 = :c1_1)')
    expect(ExpressionAttributeNames).toMatchObject({
      '#c0_1': TestTable.entityAttributeSavedAs,
      '#c1_1': TestTable.entityAttributeSavedAs
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':c0_1': Entity1.name,
      ':c1_1': Entity2.name
    })

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      (FormattedItem<typeof Entity1> | FormattedItem<typeof Entity2>)[] | undefined
    > = 1
    assertReturnedItems
  })

  it('applies two entity filters AND additional filters', () => {
    const {
      FilterExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestTable.build(ScanCommand)
      .entities(Entity1, Entity2)
      .options({
        filters: {
          entity1: { attr: 'age', gte: 40 },
          entity2: { attr: 'price', gte: 100 }
        }
      })
      .params()

    expect(FilterExpression).toBe(
      '((#c0_1 = :c0_1) AND (#c0_2 >= :c0_2)) OR ((#c1_1 = :c1_1) AND (#c1_2 >= :c1_2))'
    )
    expect(ExpressionAttributeNames).toMatchObject({
      '#c0_1': TestTable.entityAttributeSavedAs,
      '#c0_2': 'age',
      '#c1_1': TestTable.entityAttributeSavedAs,
      '#c1_2': 'price'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':c0_1': Entity1.name,
      ':c0_2': 40,
      ':c1_1': Entity2.name,
      ':c1_2': 100
    })
  })

  it('applies entity projection expression', () => {
    const { ProjectionExpression, ExpressionAttributeNames } = TestTable.build(ScanCommand)
      .entities(Entity1)
      .options({ attributes: ['age', 'name'] })
      .params()

    expect(ProjectionExpression).toBe('#p_1, #p_2')
    expect(ExpressionAttributeNames).toMatchObject({
      '#p_1': 'age',
      '#p_2': 'name'
    })
  })

  it('applies two entity projection expressions', () => {
    const { ProjectionExpression, ExpressionAttributeNames } = TestTable.build(ScanCommand)
      .entities(Entity1, Entity2)
      .options({
        attributes: ['created', 'modified']
      })
      .params()

    expect(ProjectionExpression).toBe('#p_1, #p_2')
    expect(ExpressionAttributeNames).toMatchObject({ '#p_1': '_ct', '#p_2': '_md' })
  })

  it('fails on extra options', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.unknownOption' }))
  })
})
