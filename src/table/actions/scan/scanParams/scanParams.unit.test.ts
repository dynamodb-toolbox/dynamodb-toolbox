import type { A } from 'ts-toolbelt'

import {
  DynamoDBToolboxError,
  Entity,
  ScanCommand,
  Table,
  item,
  number,
  prefix,
  string
} from '~/index.js'
import type { FormattedItem } from '~/index.js'
import type { Merge } from '~/types/merge.js'

const TestTable = new Table({
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
    },
    lsi: {
      type: 'local',
      sortKey: {
        name: 'gsi_sk',
        type: 'string'
      }
    }
  }
})

const Entity1 = new Entity({
  name: 'entity1',
  schema: item({
    userPoolId: string().key().savedAs('pk'),
    userId: string().key().savedAs('sk'),
    name: string(),
    age: number(),
    common: string().optional()
  }),
  table: TestTable
})

const Entity2 = new Entity({
  name: 'entity2',
  schema: item({
    productGroupId: string().key().savedAs('pk'),
    productId: string().key().savedAs('sk'),
    launchDate: string(),
    price: number(),
    common: string().optional().savedAs('_c')
  }),
  table: TestTable
})

const EntityWithoutEntAttr = new Entity({
  name: 'entity3',
  schema: item({
    categoryId: string().key().savedAs('pk'),
    productId: string().key().savedAs('sk'),
    launchDate: string(),
    price: number()
  }),
  table: TestTable,
  entityAttribute: false
})

describe('scan', () => {
  test('gets the tableName', async () => {
    const command = TestTable.build(ScanCommand)
    const { TableName } = command.params()

    expect(TableName).toBe('test-table')

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      FormattedItem[] | undefined
    > = 1
    assertReturnedItems
  })

  // --- OPTIONS ---

  test('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestTable.build(ScanCommand)
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  test('throws on invalid capacity option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          capacity: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidCapacityOption' }))
  })

  test('sets consistent option', () => {
    const { ConsistentRead: ConsistentReadA } = TestTable.build(ScanCommand)
      .options({ consistent: true })
      .params()

    expect(ConsistentReadA).toBe(true)

    const { ConsistentRead: ConsistentReadB } = TestTable.build(ScanCommand)
      .options({ index: 'lsi', consistent: true })
      .params()

    expect(ConsistentReadB).toBe(true)
  })

  test('throws on invalid consistent option', () => {
    const invalidCallA = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          consistent: 'true'
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'options.invalidConsistentOption' })
    )

    const invalidCallB = () =>
      TestTable.build(ScanCommand)
        // @ts-expect-error
        .options({
          index: 'gsi',
          consistent: true
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'options.invalidConsistentOption' })
    )
  })

  test('sets exclusiveStartKey option', () => {
    const { ExclusiveStartKey } = TestTable.build(ScanCommand)
      .options({ exclusiveStartKey: { foo: 'bar' } })
      .params()

    expect(ExclusiveStartKey).toStrictEqual({ foo: 'bar' })
  })

  test('sets index option', () => {
    const { IndexName } = TestTable.build(ScanCommand).options({ index: 'gsi' }).params()

    expect(IndexName).toBe('gsi')
  })

  test('throws on invalid index option', () => {
    const invalidCallA = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          index: { foo: 'bar' }
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'options.invalidIndexOption' }))

    const invalidCallB = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          index: 'unexisting-index'
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'options.invalidIndexOption' }))
  })

  test('sets select option', () => {
    const { Select } = TestTable.build(ScanCommand).options({ select: 'COUNT' }).params()

    expect(Select).toBe('COUNT')
  })

  test('throws on invalid select option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          select: 'foobar'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidSelectOption' }))
  })

  test('sets "ALL_PROJECTED_ATTRIBUTES" select option if an index is provided', () => {
    const { Select } = TestTable.build(ScanCommand)
      .options({ select: 'ALL_PROJECTED_ATTRIBUTES', index: 'gsi' })
      .params()

    expect(Select).toBe('ALL_PROJECTED_ATTRIBUTES')
  })

  test('throws if select option is "ALL_PROJECTED_ATTRIBUTES" but no index is provided', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        // @ts-expect-error
        .options({ select: 'ALL_PROJECTED_ATTRIBUTES' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidSelectOption' }))
  })

  test('accepts "SPECIFIC_ATTRIBUTES" select option if a projection expression has been provided', () => {
    const { Select } = TestTable.build(ScanCommand)
      .entities(Entity1)
      .options({ attributes: ['age'], select: 'SPECIFIC_ATTRIBUTES' })
      .params()

    expect(Select).toBe('SPECIFIC_ATTRIBUTES')
  })

  test('throws if a projection expression has been provided but select option is NOT "SPECIFIC_ATTRIBUTES"', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .entities(Entity1)
        // @ts-expect-error
        .options({ attributes: { entity1: ['age'] }, select: 'ALL_ATTRIBUTES' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidSelectOption' }))
  })

  test('sets limit option', () => {
    const { Limit } = TestTable.build(ScanCommand).options({ limit: 3 }).params()

    expect(Limit).toBe(3)
  })

  test('throws on invalid limit option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          limit: '3'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidLimitOption' }))
  })

  test('ignores valid maxPages option', () => {
    const validCallA = () => TestTable.build(ScanCommand).options({ maxPages: 3 }).params()
    expect(validCallA).not.toThrow()

    const validCallB = () => TestTable.build(ScanCommand).options({ maxPages: Infinity }).params()
    expect(validCallB).not.toThrow()
  })

  test('throws on invalid maxPages option', () => {
    const invalidCallA = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          maxPages: '3'
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'options.invalidMaxPagesOption' }))

    // Unable to ts-expect-error here
    const invalidCallB = () => TestTable.build(ScanCommand).options({ maxPages: 0 }).params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'options.invalidMaxPagesOption' }))
  })

  test('sets segment and totalSegments options', () => {
    const { Segment, TotalSegments } = TestTable.build(ScanCommand)
      .options({ segment: 3, totalSegments: 4 })
      .params()

    expect(Segment).toBe(3)
    expect(TotalSegments).toBe(4)
  })

  test('throws on invalid segment and/or totalSegments options', () => {
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

  test('overrides tableName', () => {
    const { TableName } = TestTable.build(ScanCommand).options({ tableName: 'tableName' }).params()

    expect(TableName).toBe('tableName')
  })

  test('throws on invalid tableName option', () => {
    // segment without totalSegment option
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          tableName: 42
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidTableNameOption' }))
  })

  test('appends entity name if showEntityAttr is true', () => {
    const command = TestTable.build(ScanCommand).entities(Entity1).options({ showEntityAttr: true })
    command.params()

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      Merge<FormattedItem<typeof Entity1>, { entity: 'entity1' }>[] | undefined
    > = 1
    assertReturnedItems
  })

  test('throws on invalid showEntityAttr option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        // @ts-expect-error
        .options({ showEntityAttr: 'true' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'options.invalidShowEntityAttrOption' })
    )
  })

  test('throws on invalid entityAttrFilter option', () => {
    const invalidCallA = () =>
      TestTable.build(ScanCommand)
        // @ts-expect-error
        .options({ entityAttrFilter: 'true' })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'options.invalidEntityAttrFilterOption' })
    )

    const invalidCallB = () =>
      TestTable.build(ScanCommand)
        .entities(Entity1, EntityWithoutEntAttr)
        .options({ entityAttrFilter: true })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'options.invalidEntityAttrFilterOption' })
    )

    const invalidCallC = () =>
      TestTable.build(ScanCommand)
        .entities(Entity1, Entity2)
        .options({
          filters: {
            entity1: { attr: 'age', gte: 40 },
            entity2: { attr: 'price', gte: 100 }
          },
          entityAttrFilter: false
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(
      expect.objectContaining({ code: 'options.invalidEntityAttrFilterOption' })
    )
  })

  test('throws on invalid noEntityMatchBehavior option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        // @ts-expect-error
        .options({ noEntityMatchBehavior: 'Throw' })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'options.invalidNoEntityMatchBehaviorOption' })
    )
  })

  test('throws on extra options', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.unknownOption' }))
  })

  // --- FILTERS ---

  test('applies blind filter if no entity has been provided', () => {
    const command = TestTable.build(ScanCommand).options({ filter: { attr: 'foo', eq: 'bar' } })
    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      command.params()

    expect(FilterExpression).toBe('#c_1 = :c_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#c_1': 'foo' })
    expect(ExpressionAttributeValues).toMatchObject({ ':c_1': 'bar' })
  })

  test('ignores blind filter if entities have been provided', () => {
    const command = TestTable.build(ScanCommand)
      .entities(Entity1)
      .options({
        // @ts-expect-error
        filter: { attr: 'foo', eq: 'bar' }
      })
    const { ExpressionAttributeNames = {}, ExpressionAttributeValues = {} } = command.params()

    expect(Object.values(ExpressionAttributeNames)).not.toContain('foo')
    expect(Object.values(ExpressionAttributeValues)).not.toContain('bar')
  })

  test('applies entity name filter if possible', () => {
    const command = TestTable.build(ScanCommand).entities(Entity1, Entity2)
    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      command.params()

    expect(FilterExpression).toBe('(#c_1 = :c_1) OR (#c_1 = :c_2)')
    expect(ExpressionAttributeNames).toMatchObject({
      '#c_1': TestTable.entityAttributeSavedAs
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':c_1': Entity1.entityName,
      ':c_2': Entity2.entityName
    })
  })

  test('does not apply entity name filter if not possible', () => {
    const command = TestTable.build(ScanCommand).entities(EntityWithoutEntAttr)
    const { FilterExpression } = command.params()

    expect(FilterExpression).toBeUndefined()
  })

  test('does not apply entity name filter if entityAttrFilter is false', () => {
    const { FilterExpression } = TestTable.build(ScanCommand)
      .entities(Entity1)
      .options({ entityAttrFilter: false })
      .params()

    expect(FilterExpression).toBe(undefined)
  })

  test('applies the filter if a single entity without entityAttr is provided', () => {
    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      TestTable.build(ScanCommand)
        .entities(EntityWithoutEntAttr)
        .options({
          filters: {
            entity3: { attr: 'price', gte: 100 }
          },
          entityAttrFilter: false
        })
        .params()

    expect(FilterExpression).toBe('#c_1 >= :c_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#c_1': 'price' })
    expect(ExpressionAttributeValues).toMatchObject({ ':c_1': 100 })
  })

  test('applies the filter if a single entity is provided and entityAttrFilter is false', () => {
    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      TestTable.build(ScanCommand)
        .entities(Entity1)
        .options({
          filters: {
            entity1: { attr: 'age', gte: 40 }
          },
          entityAttrFilter: false
        })
        .params()

    expect(FilterExpression).toBe('#c_1 >= :c_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#c_1': 'age' })
    expect(ExpressionAttributeValues).toMatchObject({ ':c_1': 40 })
  })

  test('applies two entity filters AND additional filters if possible', () => {
    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      TestTable.build(ScanCommand)
        .entities(Entity1, Entity2)
        .options({
          filters: {
            entity1: { attr: 'age', gte: 40 },
            entity2: { attr: 'price', gte: 100 }
          }
        })
        .params()

    expect(FilterExpression).toBe(
      '((#c_1 = :c_1) AND (#c_2 >= :c_2)) OR ((#c_1 = :c_3) AND (#c_3 >= :c_4))'
    )
    expect(ExpressionAttributeNames).toMatchObject({
      '#c_1': TestTable.entityAttributeSavedAs,
      '#c_2': 'age',
      '#c_3': 'price'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':c_1': Entity1.entityName,
      ':c_2': 40,
      ':c_3': Entity2.entityName,
      ':c_4': 100
    })
  })

  test('transforms attributes when applying filters', () => {
    const TestEntity3 = new Entity({
      name: 'entity3',
      schema: item({
        email: string().key().savedAs('pk'),
        sort: string().key().savedAs('sk'),
        transformedStr: string().transform(prefix('foo'))
      }),
      table: TestTable
    })

    const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      TestTable.build(ScanCommand)
        .entities(TestEntity3)
        .options({
          filters: {
            entity3: { attr: 'transformedStr', gte: 'bar', transform: false }
          }
        })
        .params()

    expect(FilterExpression).toContain('#c_2 >= :c_2')
    expect(ExpressionAttributeNames).toMatchObject({ '#c_2': 'transformedStr' })
    expect(ExpressionAttributeValues).toMatchObject({ ':c_2': 'bar' })

    const { ExpressionAttributeValues: ExpressionAttributeValues2 } = TestTable.build(ScanCommand)
      .entities(TestEntity3)
      .options({
        filters: {
          entity3: { attr: 'transformedStr', gte: 'bar' }
        }
      })
      .params()

    expect(ExpressionAttributeValues2).toMatchObject({ ':c_2': 'foo#bar' })
  })

  // --- PROJECTION ---

  test('applies entity projection expression', () => {
    const command = TestTable.build(ScanCommand)
      .entities(Entity1)
      .options({ attributes: ['age', 'name'] })

    const { ProjectionExpression, ExpressionAttributeNames } = command.params()

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      FormattedItem<typeof Entity1, { attributes: 'age' | 'name' }>[] | undefined
    > = 1
    assertReturnedItems

    expect(ProjectionExpression).toBe('#p_1, #p_2, #_et')
    expect(ExpressionAttributeNames).toMatchObject({
      '#p_1': 'age',
      '#p_2': 'name',
      '#_et': '_et'
    })
  })

  test('applies two entity projection expressions', () => {
    const command = TestTable.build(ScanCommand)
      .entities(Entity1, Entity2)
      .options({ attributes: ['age', 'price', 'common'] })

    const { ProjectionExpression, ExpressionAttributeNames } = command.params()

    const assertReturnedItems: A.Equals<
      Awaited<ReturnType<typeof command.send>>['Items'],
      | (
          | FormattedItem<typeof Entity1, { attributes: 'age' | 'common' }>
          | FormattedItem<typeof Entity2, { attributes: 'price' | 'common' }>
        )[]
      | undefined
    > = 1
    assertReturnedItems

    expect(ProjectionExpression).toBe('#p_1, #p_2, #p_3, #p_4, #_et')
    expect(ExpressionAttributeNames).toMatchObject({
      '#p_1': 'age',
      '#p_2': 'common',
      '#p_3': 'price',
      '#p_4': '_c',
      '#_et': '_et'
    })
  })

  test('rejects projection expression if one entity has no match', () => {
    const command = TestTable.build(ScanCommand)
      .entities(Entity1, Entity2)
      .options({ attributes: ['age', 'name'] })

    const invalidCall = () => command.params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidProjectionExpression' })
    )
  })
})
