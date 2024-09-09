import type { A } from 'ts-toolbelt'

import {
  DynamoDBToolboxError,
  Entity,
  QueryCommand,
  Table,
  number,
  prefix,
  schema,
  string
} from '~/index.js'
import type { FormattedItem } from '~/index.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  indexes: {
    lsi: {
      type: 'local',
      sortKey: { name: 'lsiSK', type: 'number' }
    },
    gsiSimple: {
      type: 'global',
      partitionKey: { name: 'gsiSimplePK', type: 'string' }
    },
    gsiComposite: {
      type: 'global',
      partitionKey: { name: 'gsiCompositePK', type: 'string' },
      sortKey: { name: 'gsiCompositeSK', type: 'string' }
    }
  }
})

const Entity1 = new Entity({
  name: 'entity1',
  schema: schema({
    userPoolId: string().key().savedAs('pk'),
    userId: string().key().savedAs('sk'),
    name: string(),
    age: number()
  }),
  table: TestTable
})

const Entity2 = new Entity({
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
  test('gets the tableName', async () => {
    const command = TestTable.build(QueryCommand).query({ partition: 'foo' })
    const { TableName } = command.params()

    expect(TableName).toBe('test-table')

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      FormattedItem[] | undefined
    > = 1
    assertReturnedItems
  })

  test('creates simple query', () => {
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
      .query({ partition: 'foo', range: { eq: 'bar' } })
      .params()

    expect(KeyConditionExpressionB).toBe('(#c0_1 = :c0_1) AND (#c0_2 = :c0_2)')
    expect(ExpressionAttributeNamesB).toMatchObject({
      '#c0_1': TestTable.partitionKey.name,
      '#c0_2': TestTable.sortKey?.name
    })
    expect(ExpressionAttributeValuesB).toMatchObject({
      ':c0_1': 'foo',
      ':c0_2': 'bar'
    })

    const {
      KeyConditionExpression: KeyConditionExpressionC,
      ExpressionAttributeNames: ExpressionAttributeNamesC,
      ExpressionAttributeValues: ExpressionAttributeValuesC
    } = TestTable.build(QueryCommand)
      .query({ partition: 'foo', range: { gte: 'bar' } })
      .params()

    expect(KeyConditionExpressionC).toBe('(#c0_1 = :c0_1) AND (#c0_2 >= :c0_2)')
    expect(ExpressionAttributeNamesC).toMatchObject({
      '#c0_1': TestTable.partitionKey.name,
      '#c0_2': TestTable.sortKey?.name
    })
    expect(ExpressionAttributeValuesC).toMatchObject({
      ':c0_1': 'foo',
      ':c0_2': 'bar'
    })
  })

  test('throws on invalid simple query', () => {
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
            neq: 'bar'
          }
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(expect.objectContaining({ code: 'actions.invalidCondition' }))
  })

  test('creates query on LSI', () => {
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
      .query({ index: 'lsi', partition: 'foo', range: { eq: 42 } })
      .params()

    expect(KeyConditionExpressionB).toBe('(#c0_1 = :c0_1) AND (#c0_2 = :c0_2)')
    expect(ExpressionAttributeNamesB).toMatchObject({
      '#c0_1': TestTable.partitionKey.name,
      '#c0_2': TestTable.indexes.lsi.sortKey.name
    })
    expect(ExpressionAttributeValuesB).toMatchObject({
      ':c0_1': 'foo',
      ':c0_2': 42
    })

    const {
      KeyConditionExpression: KeyConditionExpressionC,
      ExpressionAttributeNames: ExpressionAttributeNamesC,
      ExpressionAttributeValues: ExpressionAttributeValuesC
    } = TestTable.build(QueryCommand)
      .query({ index: 'lsi', partition: 'foo', range: { gte: 42 } })
      .params()

    expect(KeyConditionExpressionC).toBe('(#c0_1 = :c0_1) AND (#c0_2 >= :c0_2)')
    expect(ExpressionAttributeNamesC).toMatchObject({
      '#c0_1': TestTable.partitionKey.name,
      '#c0_2': TestTable.indexes.lsi.sortKey.name
    })
    expect(ExpressionAttributeValuesC).toMatchObject({
      ':c0_1': 'foo',
      ':c0_2': 42
    })
  })

  test('throws on invalid LSI query', () => {
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
            neq: 42
          }
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(expect.objectContaining({ code: 'actions.invalidCondition' }))

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
      expect.objectContaining({ code: 'options.invalidConsistentOption' })
    )
  })

  test('creates query on GSI (simple)', () => {
    const {
      IndexName,
      KeyConditionExpression: KeyConditionExpressionA,
      ExpressionAttributeNames: ExpressionAttributeNamesA,
      ExpressionAttributeValues: ExpressionAttributeValuesA
    } = TestTable.build(QueryCommand).query({ index: 'gsiSimple', partition: 'foo' }).params()

    expect(IndexName).toBe('gsiSimple')
    expect(KeyConditionExpressionA).toBe('#c0_1 = :c0_1')
    expect(ExpressionAttributeNamesA).toStrictEqual({ '#c0_1': 'gsiSimplePK' })
    expect(ExpressionAttributeValuesA).toStrictEqual({ ':c0_1': 'foo' })

    // range is simply ignored
    const {
      KeyConditionExpression: KeyConditionExpressionB,
      ExpressionAttributeNames: ExpressionAttributeNamesB,
      ExpressionAttributeValues: ExpressionAttributeValuesB
    } = TestTable.build(QueryCommand)
      // @ts-expect-error
      .query({
        index: 'gsiSimple',
        partition: 'foo',
        range: { beginsWith: 'bar' }
      })
      .params()

    expect(KeyConditionExpressionB).toBe('#c0_1 = :c0_1')
    expect(ExpressionAttributeNamesB).toStrictEqual({ '#c0_1': 'gsiSimplePK' })
    expect(ExpressionAttributeValuesB).toStrictEqual({ ':c0_1': 'foo' })
  })

  test('throws on invalid GSI query (simple)', () => {
    const invalidCallA = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'gsiSimple',
          // @ts-expect-error
          partition: 42
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestTable.build(QueryCommand)
        .query({ index: 'gsiSimple', partition: 'foo' })
        .options({
          // @ts-expect-error
          consistent: true
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'options.invalidConsistentOption' })
    )
  })

  test('creates query on GSI (composite)', () => {
    const {
      IndexName,
      KeyConditionExpression: KeyConditionExpressionA,
      ExpressionAttributeNames: ExpressionAttributeNamesA,
      ExpressionAttributeValues: ExpressionAttributeValuesA
    } = TestTable.build(QueryCommand).query({ index: 'gsiComposite', partition: 'foo' }).params()

    expect(IndexName).toBe('gsiComposite')
    expect(KeyConditionExpressionA).toBe('#c0_1 = :c0_1')
    expect(ExpressionAttributeNamesA).toMatchObject({ '#c0_1': 'gsiCompositePK' })
    expect(ExpressionAttributeValuesA).toMatchObject({ ':c0_1': 'foo' })

    const {
      KeyConditionExpression: KeyConditionExpressionB,
      ExpressionAttributeNames: ExpressionAttributeNamesB,
      ExpressionAttributeValues: ExpressionAttributeValuesB
    } = TestTable.build(QueryCommand)
      .query({ index: 'gsiComposite', partition: 'foo', range: { eq: 'bar' } })
      .params()

    expect(KeyConditionExpressionB).toBe('(#c0_1 = :c0_1) AND (#c0_2 = :c0_2)')
    expect(ExpressionAttributeNamesB).toMatchObject({
      '#c0_1': TestTable.indexes.gsiComposite.partitionKey.name,
      '#c0_2': TestTable.indexes.gsiComposite.sortKey.name
    })
    expect(ExpressionAttributeValuesB).toMatchObject({ ':c0_1': 'foo', ':c0_2': 'bar' })

    const {
      KeyConditionExpression: KeyConditionExpressionC,
      ExpressionAttributeNames: ExpressionAttributeNamesC,
      ExpressionAttributeValues: ExpressionAttributeValuesC
    } = TestTable.build(QueryCommand)
      .query({ index: 'gsiComposite', partition: 'foo', range: { beginsWith: 'bar' } })
      .params()

    expect(KeyConditionExpressionC).toBe('(#c0_1 = :c0_1) AND (begins_with(#c0_2, :c0_2))')
    expect(ExpressionAttributeNamesC).toMatchObject({
      '#c0_1': TestTable.indexes.gsiComposite.partitionKey.name,
      '#c0_2': TestTable.indexes.gsiComposite.sortKey.name
    })
    expect(ExpressionAttributeValuesC).toMatchObject({ ':c0_1': 'foo', ':c0_2': 'bar' })
  })

  test('throws on invalid GSI query', () => {
    const invalidCallA = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'gsiComposite',
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
          index: 'gsiComposite',
          partition: 'foo',
          range: { gt: 42 }
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallC = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'gsiComposite',
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
          index: 'gsiComposite',
          partition: 'foo',
          range: {
            // @ts-expect-error
            neq: 'foo'
          }
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(expect.objectContaining({ code: 'actions.invalidCondition' }))

    const invalidCallE = () =>
      TestTable.build(QueryCommand)
        .query({
          index: 'gsiComposite',
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
      expect.objectContaining({ code: 'options.invalidConsistentOption' })
    )
  })

  // Options
  test('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  test('fails on invalid capacity option', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({
          // @ts-expect-error
          capacity: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidCapacityOption' }))
  })

  test('sets consistent option', () => {
    const { ConsistentRead } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ consistent: true })
      .params()

    expect(ConsistentRead).toBe(true)
  })

  test('sets exclusiveStartKey option', () => {
    const { ExclusiveStartKey } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ exclusiveStartKey: { foo: 'bar' } })
      .params()

    expect(ExclusiveStartKey).toStrictEqual({ foo: 'bar' })
  })

  // TO MOVE IN QUERY TEST?
  test('sets index in query', () => {
    const { IndexName } = TestTable.build(QueryCommand)
      .query({ index: 'gsiSimple', partition: 'foo' })
      .params()

    expect(IndexName).toBe('gsiSimple')
  })

  // TO MOVE IN QUERY TEST?
  test('fails on invalid index', () => {
    const invalidCallA = () =>
      TestTable.build(QueryCommand)
        .query({
          // @ts-expect-error
          index: { foo: 'bar' },
          partition: 'baz'
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'options.invalidIndexOption' }))

    const invalidCallB = () =>
      TestTable.build(QueryCommand)
        .query({
          // @ts-expect-error
          index: 'foo',
          partition: 'bar'
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'options.invalidIndexOption' }))
  })

  test('sets select option', () => {
    const { Select } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ select: 'COUNT' })
      .params()

    expect(Select).toBe('COUNT')
  })

  test('fails on invalid select option', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({
          // @ts-expect-error
          select: 'foobar'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidSelectOption' }))
  })

  test('sets "ALL_PROJECTED_ATTRIBUTES" select option if an index is provided', () => {
    const { Select } = TestTable.build(QueryCommand)
      .query({ index: 'gsiSimple', partition: 'foo' })
      .options({ select: 'ALL_PROJECTED_ATTRIBUTES' })
      .params()

    expect(Select).toBe('ALL_PROJECTED_ATTRIBUTES')
  })

  test('fails if select option is "ALL_PROJECTED_ATTRIBUTES" but no index is provided', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        // @ts-expect-error
        .options({ select: 'ALL_PROJECTED_ATTRIBUTES' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidSelectOption' }))
  })

  test('accepts "SPECIFIC_ATTRIBUTES" select option if a projection expression has been provided', () => {
    const { Select } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .entities(Entity1)
      .options({ attributes: ['age'], select: 'SPECIFIC_ATTRIBUTES' })
      .params()

    expect(Select).toBe('SPECIFIC_ATTRIBUTES')
  })

  test('fails if a projection expression has been provided but select option is NOT "SPECIFIC_ATTRIBUTES"', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .entities(Entity1)
        // @ts-expect-error
        .options({ attributes: { entity1: ['age'] }, select: 'ALL_ATTRIBUTES' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidSelectOption' }))
  })

  test('sets limit option', () => {
    const { Limit } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ limit: 3 })
      .params()

    expect(Limit).toBe(3)
  })

  test('fails on invalid limit option', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({
          // @ts-expect-error
          limit: '3'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidLimitOption' }))
  })

  test('ignores valid maxPages option', () => {
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

  test('fails on invalid maxPages option', () => {
    const invalidCallA = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({
          // @ts-expect-error
          maxPages: '3'
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'options.invalidMaxPagesOption' }))

    // Unable to ts-expect-error here
    const invalidCallB = () =>
      TestTable.build(QueryCommand).query({ partition: 'foo' }).options({ maxPages: 0 }).params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'options.invalidMaxPagesOption' }))
  })

  test('sets reverse option', () => {
    const { ScanIndexForward } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ reverse: true })
      .params()
    expect(ScanIndexForward).toBe(false)
  })

  test('fails on invalid reverse option', () => {
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

  test('overrides tableName', () => {
    const { TableName } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .options({ tableName: 'tableName' })
      .params()

    expect(TableName).toBe('tableName')
  })

  test('fails on invalid tableName option', () => {
    // segment without totalSegment option
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        // @ts-expect-error
        .options({ tableName: 42 })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidTableNameOption' }))
  })

  test('applies entity _et filter', () => {
    const command = TestTable.build(QueryCommand).query({ partition: 'foo' }).entities(Entity1)
    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      command.params()

    expect(FilterExpression).toBe('#c1_1 = :c1_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#c1_1': TestTable.entityAttributeSavedAs })
    expect(ExpressionAttributeValues).toMatchObject({ ':c1_1': Entity1.name })

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      FormattedItem<typeof Entity1>[] | undefined
    > = 1
    assertReturnedItems
  })

  test('applies entity _et AND additional filter', () => {
    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      TestTable.build(QueryCommand)
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

  test('applies two entity filters', () => {
    const command = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .entities(Entity1, Entity2)
    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      command.params()

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

  test('applies two entity filters AND additional filters', () => {
    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      TestTable.build(QueryCommand)
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

  test('transforms attributes when applying filters', () => {
    const TestEntity3 = new Entity({
      name: 'entity3',
      schema: schema({
        email: string().key().savedAs('pk'),
        sort: string().key().savedAs('sk'),
        transformedStr: string().transform(prefix('foo'))
      }),
      table: TestTable
    })

    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .entities(TestEntity3)
        .options({
          filters: {
            entity3: { attr: 'transformedStr', gte: 'bar', transform: false }
          }
        })
        .params()

    expect(FilterExpression).toContain('#c1_2 >= :c1_2')
    expect(ExpressionAttributeNames).toMatchObject({ '#c1_2': 'transformedStr' })
    expect(ExpressionAttributeValues).toMatchObject({ ':c1_2': 'bar' })

    const { ExpressionAttributeValues: ExpressionAttributeValues2 } = TestTable.build(QueryCommand)
      .query({ partition: 'foo' })
      .entities(TestEntity3)
      .options({
        filters: {
          entity3: { attr: 'transformedStr', gte: 'bar' }
        }
      })
      .params()

    expect(ExpressionAttributeValues2).toMatchObject({ ':c1_2': 'foo#bar' })
  })

  test('applies entity projection expression', () => {
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

  test('applies two entity projection expressions', () => {
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

  test('fails on extra options', () => {
    const invalidCall = () =>
      TestTable.build(QueryCommand)
        .query({ partition: 'foo' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.unknownOption' }))
  })
})
