import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import {
  TableV2,
  EntityV2,
  schema,
  any,
  binary,
  string,
  number,
  boolean,
  set,
  list,
  map,
  DynamoDBToolboxError,
  PutItemTransaction
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

const TestEntity = new EntityV2({
  name: 'TestEntity',
  schema: schema({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test_any: any().optional(),
    test_binary: binary().optional(),
    test_string: string().putDefault('test string'),
    count: number().optional().savedAs('test_number'),
    test_number_defaulted: number().putDefault(0),
    test_boolean: boolean().optional(),
    test_list: list(string()).optional(),
    test_map: map({
      str: string()
    }).optional(),
    test_string_set: set(string()).optional(),
    test_number_set: set(number()).optional(),
    test_binary_set: set(binary()).optional()
  }),
  table: TestTable
})

const TestTable2 = new TableV2({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  documentClient
})

const TestEntity2 = new EntityV2({
  name: 'TestEntity2',
  schema: schema({
    email: string().key().savedAs('pk'),
    test_composite: string().optional(),
    test_composite2: string().optional()
  }).and(schema => ({
    sort: string()
      .optional()
      .savedAs('sk')
      .putLink<typeof schema>(
        ({ test_composite, test_composite2 }) =>
          test_composite && test_composite2 && [test_composite, test_composite2].join('#')
      )
  })),
  table: TestTable2
})

const TestEntity3 = new EntityV2({
  name: 'TestEntity3',
  schema: schema({
    email: string().key().savedAs('pk'),
    test: any(),
    test2: string().optional()
  }),
  table: TestTable2
})

const TestTable3 = new TableV2({
  name: 'TestTable3',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const TestEntity4 = new EntityV2({
  name: 'TestEntity4',
  schema: schema({
    id: number().key().savedAs('pk'),
    // sk: { hidden: true, sortKey: true, default: (data: any) => data.id },
    xyz: any().optional().savedAs('test')
  }),
  computeKey: ({ id }) => ({ pk: String(id), sk: String(id) }),
  table: TestTable3
})

const TestEntity5 = new EntityV2({
  name: 'TestEntity5',
  schema: schema({
    pk: string().key(),
    test_required_boolean: boolean(),
    test_required_number: number()
  }),
  table: TestTable2
})

describe('put transaction', () => {
  it('creates basic item', () => {
    const { Item } = TestEntity.build(PutItemTransaction)
      .item({ email: 'test-pk', sort: 'test-sk' })
      .params()

    expect(Item).toMatchObject({
      _et: TestEntity.name,
      _ct: expect.any(String),
      _md: expect.any(String),
      pk: 'test-pk',
      sk: 'test-sk',
      test_string: 'test string',
      test_number_defaulted: 0
    })
  })

  it('creates item with aliases', () => {
    const { Item } = TestEntity.build(PutItemTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        count: 0
      })
      .params()

    expect(Item).toMatchObject({ test_number: 0 })
  })

  it('creates item with overridden default override', () => {
    const overrideValue = 'different value'

    const { Item } = TestEntity.build(PutItemTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string: overrideValue
      })
      .params()

    expect(Item).toMatchObject({ test_string: overrideValue })
  })

  it('creates item with composite field', () => {
    const { Item } = TestEntity2.build(PutItemTransaction)
      .item({
        email: 'test-pk',
        test_composite: 'test'
      })
      .params()

    expect(Item).not.toHaveProperty('sort')
  })

  it('creates item with filled composite key', () => {
    const { Item } = TestEntity2.build(PutItemTransaction)
      .item({
        email: 'test-pk',
        test_composite: 'test',
        test_composite2: 'test2'
      })
      .params()

    expect(Item).toMatchObject({ sk: 'test#test2' })
  })

  it('creates item with overriden composite key', () => {
    const { Item } = TestEntity2.build(PutItemTransaction)
      .item({
        email: 'test-pk',
        sort: 'override',
        test_composite: 'test',
        test_composite2: 'test2'
      })
      .params()

    expect(Item).toMatchObject({ sk: 'override' })
  })

  it('fails if required attribute misses', () => {
    expect(() =>
      TestEntity3.build(PutItemTransaction)
        .item(
          // @ts-expect-error
          { email: 'test-pk' }
        )
        .params()
    ).toThrow('Attribute test is required')
  })

  it('ignores additional attribute', () => {
    const { Item } = TestEntity.build(PutItemTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        // @ts-expect-error
        unknown: '?'
      })
      .params()

    expect(Item).not.toHaveProperty('unknown')
  })

  it('fails when invalid string provided with no coercion', () => {
    expect(() =>
      TestEntity.build(PutItemTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_string: 1
        })
        .params()
    ).toThrow('Attribute test_string should be a string')
  })

  it('fails when invalid boolean provided with no coercion', () => {
    expect(() =>
      TestEntity.build(PutItemTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_boolean: 'x'
        })
        .params()
    ).toThrow('Attribute test_boolean should be a boolean')
  })

  it('fails when invalid number provided with no coercion', () => {
    expect(() =>
      TestEntity.build(PutItemTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          count: 'x'
        })
        .params()
    ).toThrow('Attribute count should be a number')
  })

  it('with valid array', () => {
    const { Item } = TestEntity.build(PutItemTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: ['a', 'b']
      })
      .params()

    expect(Item).toMatchObject({
      test_list: ['a', 'b']
    })
  })

  it('fails when invalid array provided', () => {
    expect(() =>
      TestEntity.build(PutItemTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list: ['a', 2]
        })
        .params()
    ).toThrow('Attribute test_list[n] should be a string')
  })

  it('with valid map', () => {
    const { Item } = TestEntity.build(PutItemTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: {
          str: 'x'
        }
      })
      .params()

    expect(Item).toMatchObject({
      test_map: { str: 'x' }
    })
  })

  it('fails when invalid map provided', () => {
    expect(() =>
      TestEntity.build(PutItemTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_map: { str: 2 }
        })
        .params()
    ).toThrow('Attribute test_map.str should be a string')
  })

  it('with valid set', () => {
    const { Item } = TestEntity.build(PutItemTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string_set: new Set(['a', 'b', 'c'])
      })
      .params()

    expect(Item).toMatchObject({
      test_string_set: new Set(['a', 'b', 'c'])
    })
  })

  it('fails when set contains different types', () => {
    expect(() =>
      TestEntity.build(PutItemTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_string_set: new Set(['a', 'b', 3])
        })
        .params()
    ).toThrow('Attribute test_string_set[x] should be a string')
  })

  it('fails when missing a required field', () => {
    expect(() =>
      TestEntity3.build(PutItemTransaction)
        .item(
          // @ts-expect-error
          { email: 'test-pk', test2: 'test' }
        )
        .params()
    ).toThrow('Attribute test is required')
  })

  it('puts 0 and false to required fields', () => {
    const { Item } = TestEntity5.build(PutItemTransaction)
      .item({
        pk: 'test-pk',
        test_required_boolean: false,
        test_required_number: 0
      })
      .params()

    expect(Item).toMatchObject({
      test_required_boolean: false,
      test_required_number: 0
    })
  })

  it('correctly aliases pks', () => {
    const { Item } = TestEntity4.build(PutItemTransaction).item({ id: 3, xyz: '123' }).params()
    expect(Item).toMatchObject({ pk: '3', sk: '3' })
  })

  // Options
  it('fails on extra options', () => {
    const invalidCall = () =>
      TestEntity.build(PutItemTransaction)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.unknownOption' }))
  })

  it('sets condition', () => {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = TestEntity.build(PutItemTransaction)
      .item({ email: 'x', sort: 'y' })
      .options({ condition: { attr: 'email', gt: 'test' } })
      .params()

    expect(ExpressionAttributeNames).toEqual({ '#c_1': 'pk' })
    expect(ExpressionAttributeValues).toEqual({ ':c_1': 'test' })
    expect(ConditionExpression).toBe('#c_1 > :c_1')
  })

  it('missing item', () => {
    const invalidCall = () => TestEntity.build(PutItemTransaction).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.incompleteCommand' }))
  })
})
