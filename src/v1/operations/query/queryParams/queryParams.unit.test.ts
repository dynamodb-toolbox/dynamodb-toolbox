import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { A } from 'ts-toolbelt'

import {
  TableV2,
  DynamoDBToolboxError,
  QueryCommand,
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
  indexes: {
    lsi: {
      type: 'local',
      sortKey: {
        name: 'lsi_sk',
        type: 'number'
      }
    },
    gsi: {
      type: 'global',
      partitionKey: {
        name: 'gsi_pk',
        type: 'string'
      },
      sortKey: {
        name: 'gsi_sk',
        type: 'string'
      }
    }
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

describe('query', () => {
  it('gets the tableName', async () => {
    const command = TestTable.build(QueryCommand).query({ partition: 'foo' })
    const { TableName } = command.params()

    expect(TableName).toBe('test-table')

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      Item[] | undefined
    > = 1
    assertReturnedItems
  })

  it('creates simple query', () => {
    const {
      KeyConditionExpression: KeyConditionExpressionA,
      ExpressionAttributeNames: ExpressionAttributeNamesA,
      ExpressionAttributeValues: ExpressionAttributeValuesA
    } = TestTable.build(QueryCommand).query({ partition: 'foo' }).params()

    expect(KeyConditionExpressionA).toBe('#c0_1 = :c0_1')
    expect(ExpressionAttributeNamesA).toMatchObject({ '#c0_1': TestTable.partitionKey.name })
    expect(ExpressionAttributeValuesA).toMatchObject({ ':c0_1': 'foo' })

    const {
      KeyConditionExpression: KeyConditionExpressionB,
      ExpressionAttributeNames: ExpressionAttributeNamesB,
      ExpressionAttributeValues: ExpressionAttributeValuesB
    } = TestTable.build(QueryCommand)
      .query({ partition: 'foo', range: { gte: 'bar' } })
      .params()

    expect(KeyConditionExpressionB).toBe('(#c0_1 = :c0_1) AND (#c0_2 >= :c0_2)')
    expect(ExpressionAttributeNamesB).toMatchObject({
      '#c0_1': TestTable.partitionKey.name,
      '#c0_2': TestTable.sortKey?.name
    })
    expect(ExpressionAttributeValuesB).toMatchObject({
      ':c0_1': 'foo',
      ':c0_2': 'bar'
    })
  })

  it('throws on invalid simple query', () => {
    const invalidCallA = () =>
      TestTable.build(QueryCommand)
        .query({
          // @ts-expect-error
          partition: 42
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestTable.build(QueryCommand)
        // @ts-expect-error
        .query({
          partition: 'foo',
          range: {
            gt: 42
          }
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallC = () =>
      TestTable.build(QueryCommand)
        .query({
          partition: 'foo',
          range: {
            // @ts-expect-error
            gt: { foo: 'bar' }
          }
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestTable.build(QueryCommand)
        .query({
          partition: 'foo',
          range: {
            // @ts-expect-error
            eq: 'bar'
          }
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(expect.objectContaining({ code: 'operations.invalidCondition' }))
  })

  it('creates query on LSI', () => {
    const {
      IndexName,
      KeyConditionExpression: KeyConditionExpressionA,
      ExpressionAttributeNames: ExpressionAttributeNamesA,
      ExpressionAttributeValues: ExpressionAttributeValuesA
    } = TestTable.build(QueryCommand).query({ index: 'lsi', partition: 'foo' }).params()

    expect(IndexName).toBe('lsi')
    expect(KeyConditionExpressionA).toBe('#c0_1 = :c0_1')
    expect(ExpressionAttributeNamesA).toMatchObject({ '#c0_1': TestTable.partitionKey.name })
    expect(ExpressionAttributeValuesA).toMatchObject({ ':c0_1': 'foo' })

    const {
      KeyConditionExpression: KeyConditionExpressionB,
      ExpressionAttributeNames: ExpressionAttributeNamesB,
      ExpressionAttributeValues: ExpressionAttributeValuesB
    } = TestTable.build(QueryCommand)
      .query({ index: 'lsi', partition: 'foo', range: { gte: 42 } })
      .params()

    expect(KeyConditionExpressionB).toBe('(#c0_1 = :c0_1) AND (#c0_2 >= :c0_2)')
    expect(ExpressionAttributeNamesB).toMatchObject({
      '#c0_1': TestTable.partitionKey.name,
      '#c0_2': TestTable.indexes.lsi.sortKey.name
    })
    expect(ExpressionAttributeValuesB).toMatchObject({
      ':c0_1': 'foo',
      ':c0_2': 42
    })
  })

  it('throws on invalid LSI query', () => {
    const invalidCallA = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'lsi',
          // @ts-expect-error
          partition: 42
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestTable.build(QueryCommand)
        // @ts-expect-error
        .query({
          index: 'lsi',
          partition: 'foo',
          range: { gt: 'bar' }
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallC = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'lsi',
          partition: 'foo',
          range: {
            // @ts-expect-error
            gt: { foo: 'bar' }
          }
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'lsi',
          partition: 'foo',
          range: {
            // @ts-expect-error
            eq: 42
          }
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(expect.objectContaining({ code: 'operations.invalidCondition' }))

    const invalidCallE = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'lsi',
          partition: 'foo',
          range: { gt: 42 }
        })
        .options({
          // @ts-expect-error
          consistent: true
        })
        .params()

    expect(invalidCallE).toThrow(DynamoDBToolboxError)
    expect(invalidCallE).toThrow(
      expect.objectContaining({ code: 'operations.invalidConsistentOption' })
    )
  })

  it('creates query on GSI', () => {
    const {
      IndexName,
      KeyConditionExpression: KeyConditionExpressionA,
      ExpressionAttributeNames: ExpressionAttributeNamesA,
      ExpressionAttributeValues: ExpressionAttributeValuesA
    } = TestTable.build(QueryCommand).query({ index: 'gsi', partition: 'foo' }).params()

    expect(IndexName).toBe('gsi')
    expect(KeyConditionExpressionA).toBe('#c0_1 = :c0_1')
    expect(ExpressionAttributeNamesA).toMatchObject({ '#c0_1': 'gsi_pk' })
    expect(ExpressionAttributeValuesA).toMatchObject({ ':c0_1': 'foo' })

    const {
      KeyConditionExpression: KeyConditionExpressionB,
      ExpressionAttributeNames: ExpressionAttributeNamesB,
      ExpressionAttributeValues: ExpressionAttributeValuesB
    } = TestTable.build(QueryCommand)
      .query({ index: 'gsi', partition: 'foo', range: { beginsWith: 'bar' } })
      .params()

    expect(KeyConditionExpressionB).toBe('(#c0_1 = :c0_1) AND (begins_with(#c0_2, :c0_2))')
    expect(ExpressionAttributeNamesB).toMatchObject({
      '#c0_1': TestTable.indexes.gsi.partitionKey.name,
      '#c0_2': TestTable.indexes.gsi.sortKey.name
    })
    expect(ExpressionAttributeValuesB).toMatchObject({
      ':c0_1': 'foo',
      ':c0_2': 'bar'
    })
  })

  it('throws on invalid GSI query', () => {
    const invalidCallA = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'gsi',
          // @ts-expect-error
          partition: 42
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestTable.build(QueryCommand)
        // @ts-expect-error
        .query({
          index: 'gsi',
          partition: 'foo',
          range: { gt: 42 }
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallC = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'gsi',
          partition: 'foo',
          range: {
            // @ts-expect-error
            gt: { foo: 'bar' }
          }
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'gsi',
          partition: 'foo',
          range: {
            // @ts-expect-error
            eq: 'foo'
          }
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(expect.objectContaining({ code: 'operations.invalidCondition' }))

    const invalidCallE = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'gsi',
          partition: 'foo',
          range: { gt: 'bar' }
        })
        .options({
          // @ts-expect-error
          consistent: true
        })
        .params()

    expect(invalidCallE).toThrow(DynamoDBToolboxError)
    expect(invalidCallE).toThrow(
      expect.objectContaining({ code: 'operations.invalidConsistentOption' })
    )
  })

  // Options
  it('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('fails on invalid capacity option', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({
          // @ts-expect-error
          capacity: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'operations.invalidCapacityOption' })
    )
  })

  it('sets consistent option', () => {
    const { ConsistentRead } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ consistent: true })
      .params()

    expect(ConsistentRead).toBe(true)
  })

  it('sets exclusiveStartKey option', () => {
    const { ExclusiveStartKey } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ exclusiveStartKey: { foo: 'bar' } })
      .params()

    expect(ExclusiveStartKey).toStrictEqual({ foo: 'bar' })
  })

  // TO MOVE IN QUERY TEST?
  it('sets index in query', () => {
    const { IndexName } = TestTable.build(QueryCommand)
      .query({ index: 'gsi', partition: 'foo' })
      .params()

    expect(IndexName).toBe('gsi')
  })

  // TO MOVE IN QUERY TEST?
  it('fails on invalid index', () => {
    const invalidCallA = () =>
      TestTable.build(QueryCommand)
        .query({
          // @ts-expect-error
          index: { foo: 'bar' },
          partition: 'baz'
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'operations.invalidIndexOption' }))

    const invalidCallB = () =>
      TestTable.build(QueryCommand)
        .query({
          // @ts-expect-error
          index: 'foo',
          partition: 'bar'
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'operations.invalidIndexOption' }))
  })

  it('sets select option', () => {
    const { Select } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ select: 'COUNT' })
      .params()

    expect(Select).toBe('COUNT')
  })

  it('fails on invalid select option', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({
          // @ts-expect-error
          select: 'foobar'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.invalidSelectOption' }))
  })

  it('sets "ALL_PROJECTED_ATTRIBUTES" select option if an index is provided', () => {
    const { Select } = TestTable.build(QueryCommand)
      .query({ index: 'gsi', partition: 'foo' })
      .options({ select: 'ALL_PROJECTED_ATTRIBUTES' })
      .params()

    expect(Select).toBe('ALL_PROJECTED_ATTRIBUTES')
  })

  it('fails if select option is "ALL_PROJECTED_ATTRIBUTES" but no index is provided', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        // @ts-expect-error
        .options({ select: 'ALL_PROJECTED_ATTRIBUTES' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.invalidSelectOption' }))
  })

  it('accepts "SPECIFIC_ATTRIBUTES" select option if a projection expression has been provided', () => {
    const { Select } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .entities(Entity1)
      .options({ attributes: ['age'], select: 'SPECIFIC_ATTRIBUTES' })
      .params()

    expect(Select).toBe('SPECIFIC_ATTRIBUTES')
  })

  it('fails if a projection expression has been provided but select option is NOT "SPECIFIC_ATTRIBUTES"', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .entities(Entity1)
        // @ts-expect-error
        .options({ attributes: { entity1: ['age'] }, select: 'ALL_ATTRIBUTES' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.invalidSelectOption' }))
  })

  it('sets limit option', () => {
    const { Limit } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ limit: 3 })
      .params()

    expect(Limit).toBe(3)
  })

  it('fails on invalid limit option', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({
          // @ts-expect-error
          limit: '3'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.invalidLimitOption' }))
  })

  it('ignores valid maxPages option', () => {
    const validCallA = () =>
      TestTable.build(QueryCommand).query({ partition: 'foo' }).options({ maxPages: 3 }).params()
    expect(validCallA).not.toThrow()

    const validCallB = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({ maxPages: Infinity })
        .params()
    expect(validCallB).not.toThrow()
  })

  it('fails on invalid maxPages option', () => {
    const invalidCallA = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({
          // @ts-expect-error
          maxPages: '3'
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'operations.invalidMaxPagesOption' })
    )

    // Unable to ts-expect-error here
    const invalidCallB = () =>
      TestTable.build(QueryCommand).query({ partition: 'foo' }).options({ maxPages: 0 }).params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'operations.invalidMaxPagesOption' })
    )
  })

  it('sets reverse option', () => {
    const { ScanIndexForward } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ reverse: true })
      .params()
    expect(ScanIndexForward).toBe(false)
  })

  it('fails on invalid reverse option', () => {
    // segment without totalSegment option
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        // @ts-expect-error
        .options({ reverse: 'true' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'queryCommand.invalidReverseOption' })
    )
  })

  it('applies entity _et filter', () => {
    const command = TestTable.build(QueryCommand).query({ partition: 'foo' }).entities(Entity1)
    const {
      FilterExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = command.params()

    expect(FilterExpression).toBe('#c1_1 = :c1_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#c1_1': TestTable.entityAttributeSavedAs })
    expect(ExpressionAttributeValues).toMatchObject({ ':c1_1': Entity1.name })

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
    } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .entities(Entity1)
      .options({
        filters: {
          entity1: { attr: 'age', gte: 40 }
        }
      })
      .params()

    expect(FilterExpression).toBe('(#c1_1 = :c1_1) AND (#c1_2 >= :c1_2)')
    expect(ExpressionAttributeNames).toMatchObject({
      '#c1_1': TestTable.entityAttributeSavedAs,
      '#c1_2': 'age'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':c1_1': Entity1.name,
      ':c1_2': 40
    })
  })

  it('applies two entity filters', () => {
    const command = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .entities(Entity1, Entity2)
    const {
      FilterExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = command.params()

    expect(FilterExpression).toBe('(#c1_1 = :c1_1) OR (#c2_1 = :c2_1)')
    expect(ExpressionAttributeNames).toMatchObject({
      '#c1_1': TestTable.entityAttributeSavedAs,
      '#c2_1': TestTable.entityAttributeSavedAs
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':c1_1': Entity1.name,
      ':c2_1': Entity2.name
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
    } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .entities(Entity1, Entity2)
      .options({
        filters: {
          entity1: { attr: 'age', gte: 40 },
          entity2: { attr: 'price', gte: 100 }
        }
      })
      .params()

    expect(FilterExpression).toBe(
      '((#c1_1 = :c1_1) AND (#c1_2 >= :c1_2)) OR ((#c2_1 = :c2_1) AND (#c2_2 >= :c2_2))'
    )
    expect(ExpressionAttributeNames).toMatchObject({
      '#c1_1': TestTable.entityAttributeSavedAs,
      '#c1_2': 'age',
      '#c2_1': TestTable.entityAttributeSavedAs,
      '#c2_2': 'price'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':c1_1': Entity1.name,
      ':c1_2': 40,
      ':c2_1': Entity2.name,
      ':c2_2': 100
    })
  })

  it('applies entity projection expression', () => {
    const command = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .entities(Entity1)
      .options({ attributes: ['age', 'name'] })

    const { ProjectionExpression, ExpressionAttributeNames } = command.params()

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      FormattedItem<typeof Entity1, { attributes: 'age' | 'name' }>[] | undefined
    > = 1
    assertReturnedItems

    expect(ProjectionExpression).toBe('#p_1, #p_2, #p_3')
    expect(ExpressionAttributeNames).toMatchObject({
      '#p_1': '_et',
      '#p_2': 'age',
      '#p_3': 'name'
    })
  })

  it('applies two entity projection expressions', () => {
    const command = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .entities(Entity1, Entity2)
      .options({
        attributes: ['created', 'modified']
      })

    const { ProjectionExpression, ExpressionAttributeNames } = command.params()

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      | (
          | FormattedItem<typeof Entity1, { attributes: 'created' | 'modified' }>
          | FormattedItem<typeof Entity2, { attributes: 'created' | 'modified' }>
        )[]
      | undefined
    > = 1
    assertReturnedItems

    expect(ProjectionExpression).toBe('#p_1, #p_2, #p_3')
    expect(ExpressionAttributeNames).toMatchObject({
      '#p_1': '_et',
      '#p_2': '_ct',
      '#p_3': '_md'
    })
  })

  it('fails on extra options', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.unknownOption' }))
  })
})
