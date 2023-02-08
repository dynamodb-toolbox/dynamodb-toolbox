import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import {
  TableV2,
  EntityV2,
  item,
  any,
  binary,
  string,
  number,
  boolean,
  set,
  list,
  map,
  ComputedDefault,
  DynamoDBToolboxError
} from 'v1'

import { putItemParams } from './putItemParams'

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
  item: item({
    email: string().key().savedAs('pk').required('always'),
    sort: string().key().savedAs('sk').required('always'),
    test_any: any().optional(),
    test_binary: binary().optional(),
    test_string: string().default('test string'),
    count: number().optional().savedAs('test_number'),
    test_number_default: number().default(0),
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
  item: item({
    email: string().key().required('always').savedAs('pk'),
    sort: string().optional().savedAs('sk').default(ComputedDefault),
    test_composite: string().optional(),
    test_composite2: string().optional()
  }),
  computedDefaults: {
    sort: ({ test_composite, test_composite2 }) =>
      test_composite && test_composite2 && [test_composite, test_composite2].join('#')
  },
  table: TestTable2
})

const TestEntity3 = new EntityV2({
  name: 'TestEntity3',
  item: item({
    email: string().key().required('always').savedAs('pk'),
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
  item: item({
    id: number().required('always').key().savedAs('pk'),
    // sk: { hidden: true, sortKey: true, default: (data: any) => data.id },
    xyz: any().optional().savedAs('test')
  }),
  computeKey: ({ id }) => ({ pk: String(id), sk: String(id) }),
  table: TestTable3
})

const TestEntity5 = new EntityV2({
  name: 'TestEntity5',
  item: item({
    pk: string().key().required('always'),
    test_required_boolean: boolean(),
    test_required_number: number()
  }),
  table: TestTable2
})

describe('put', () => {
  it('creates basic item', () => {
    const { Item } = putItemParams(TestEntity, { email: 'test-pk', sort: 'test-sk' })

    expect(Item).toMatchObject({
      // TODO
      // _et: 'TestEntity',
      // _ct:
      // _md
      pk: 'test-pk',
      sk: 'test-sk',
      test_string: 'test string',
      test_number_default: 0
    })
  })

  it('creates item with aliases', () => {
    const { Item } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      count: 0
    })

    expect(Item).toMatchObject({ test_number: 0 })
  })

  it('creates item with overridden default override', () => {
    const overrideValue = 'different value'

    const { Item } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      test_string: overrideValue
    })

    expect(Item).toMatchObject({ test_string: overrideValue })
  })

  it('creates item with saved composite field', () => {
    const { Item } = putItemParams(TestEntity2, {
      email: 'test-pk',
      test_composite: 'test'
    })

    expect(Item).toStrictEqual({
      pk: 'test-pk',
      test_composite: 'test'
    })
  })

  it('creates item that ignores field with no value', () => {
    const { Item } = putItemParams(TestEntity2, {
      email: 'test-pk',
      test_composite: undefined
    })

    expect(Item).toStrictEqual({
      pk: 'test-pk'
    })
  })

  it('creates item that overrides composite key', () => {
    const { Item } = putItemParams(TestEntity2, {
      email: 'test-pk',
      sort: 'override',
      test_composite: 'test',
      test_composite2: 'test2'
    })

    expect(Item).toStrictEqual({
      pk: 'test-pk',
      sk: 'override',
      test_composite: 'test',
      // TODO: Make saved:false possible (as in original test)
      test_composite2: 'test2'
    })
  })

  it('creates item that generates composite key', () => {
    const { Item } = putItemParams(TestEntity2, {
      email: 'test-pk',
      test_composite: 'test',
      test_composite2: 'test2'
    })

    expect(Item).toStrictEqual({
      pk: 'test-pk',
      sk: 'test#test2',
      test_composite: 'test',
      // TODO: Make saved:false possible (as in original test)
      test_composite2: 'test2'
    })
  })

  it('fails if required attribute misses', () => {
    expect(
      () =>
        putItemParams(
          TestEntity3,
          // @ts-expect-error
          { email: 'test-pk' }
        )
      // TODO: Nice error message
    ).toThrow('')
  })

  it('ignores additional attribute if item is closed and strict mode is off (TODO)', () => {
    const { Item } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      // @ts-expect-error
      unknown: '?'
    })

    expect(Item).not.toHaveProperty('unknown')
  })

  it('fails when invalid string provided with no coercion', () => {
    expect(
      () =>
        putItemParams(TestEntity, {
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_string: 1
        })
      // TODO: Nice error message
    ).toThrow('')
  })

  it('fails when invalid boolean provided with no coercion', () => {
    expect(
      () =>
        putItemParams(TestEntity, {
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_boolean: 'x'
        })
      // TODO: Nice error message
    ).toThrow('')
  })

  it('fails when invalid number provided with no coercion', () => {
    expect(
      () =>
        putItemParams(TestEntity, {
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          count: 'x'
        })
      // TODO: Nice error message
    ).toThrow('')
  })

  it('with valid array', () => {
    const { Item } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      test_list: ['a', 'b']
    })

    expect(Item).toMatchObject({
      test_list: ['a', 'b']
    })
  })

  it('fails when invalid array provided', () => {
    expect(
      () =>
        putItemParams(TestEntity, {
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list: ['a', 2]
        })
      // TODO: Nice error message
    ).toThrow('')
  })

  it('with valid map', () => {
    const { Item } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      test_map: {
        str: 'x'
      }
    })

    expect(Item).toMatchObject({
      test_map: { str: 'x' }
    })
  })

  it('fails when invalid map provided', () => {
    expect(
      () =>
        putItemParams(TestEntity, {
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_map: { str: 2 }
        })
      // TODO: Nice error message
    ).toThrow('')
  })

  it('with valid set', () => {
    const { Item } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      test_string_set: new Set(['a', 'b', 'c'])
    })

    expect(Item).toMatchObject({
      test_string_set: new Set(['a', 'b', 'c'])
    })
  })

  it('fails when set contains different types', () => {
    expect(
      () =>
        putItemParams(TestEntity, {
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_string_set: new Set(['a', 'b', 3])
        })
      // TODO: Nice error message
    ).toThrow('')
  })

  it('fails when missing a required field', () => {
    expect(
      () =>
        putItemParams(
          TestEntity3,
          // @ts-expect-error
          { email: 'test-pk', test2: 'test' }
        )
      // TODO: Nice error message
    ).toThrow('')
  })

  it('puts 0 and false to required fields', () => {
    const { Item } = putItemParams(TestEntity5, {
      pk: 'test-pk',
      test_required_boolean: false,
      test_required_number: 0
    })

    expect(Item).toMatchObject({
      test_required_boolean: false,
      test_required_number: 0
    })
  })

  it('correctly aliases pks', () => {
    const { Item } = putItemParams(TestEntity4, {
      id: 3,
      xyz: '123'
    })

    expect(Item).toStrictEqual({
      pk: '3',
      sk: '3',
      test: '123'
    })
  })

  // Options
  it('sets capacity options', () => {
    const { ReturnConsumedCapacity } = putItemParams(
      TestEntity,
      { email: 'x', sort: 'y' },
      { capacity: 'NONE' }
    )

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('fails on invalid capacity option', () => {
    const invalidCall = () =>
      putItemParams(
        TestEntity,
        { email: 'x', sort: 'y' },
        {
          // @ts-expect-error
          capacity: 'test'
        }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'invalidCapacityCommandOption' }))
  })

  it('sets metrics options', () => {
    const { ReturnItemCollectionMetrics } = putItemParams(
      TestEntity,
      { email: 'x', sort: 'y' },
      { metrics: 'SIZE' }
    )

    expect(ReturnItemCollectionMetrics).toBe('SIZE')
  })

  it('fails on invalid metrics option', () => {
    const invalidCall = () =>
      putItemParams(
        TestEntity,
        { email: 'x', sort: 'y' },
        {
          // @ts-expect-error
          metrics: 'test'
        }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'invalidPutItemCommandMetricsOption' })
    )
  })

  it('sets returnValues options', () => {
    const { ReturnValues } = putItemParams(
      TestEntity,
      { email: 'x', sort: 'y' },
      { returnValues: 'ALL_OLD' }
    )

    expect(ReturnValues).toBe('ALL_OLD')
  })

  it('fails on invalid returnValues option', () => {
    const invalidCall = () =>
      putItemParams(
        TestEntity,
        { email: 'x', sort: 'y' },
        {
          // @ts-expect-error
          returnValues: 'test'
        }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'invalidPutItemReturnValuesOption' })
    )
  })

  it('fails on extra options', () => {
    const invalidCall = () =>
      putItemParams(
        TestEntity,
        { email: 'x', sort: 'y' },
        {
          // @ts-expect-error
          extra: true
        }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'unknownCommandOption' }))
  })

  // TODO Enable typed conditions
  // it('sets conditions', () => {
  //   const {
  //     TableName,
  //     ExpressionAttributeNames,
  //     ExpressionAttributeValues,
  //     ConditionExpression
  //   } = TestEntity.putParams(
  //     { email: 'x', sort: 'y' },
  //     { conditions: { attr: 'email', gt: 'test' } }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(ExpressionAttributeNames).toEqual({ '#attr1': 'pk' })
  //   expect(ExpressionAttributeValues).toEqual({ ':attr1': 'test' })
  //   expect(ConditionExpression).toBe('#attr1 > :attr1')
  // })

  // TODO Enable extra parameters
  // it('handles extra parameters', () => {
  //   const { TableName, ReturnConsumedCapacity } = TestEntity.putParams(
  //     { email: 'x', sort: 'y' },
  //     {},
  //     { ReturnConsumedCapacity: 'NONE' }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(ReturnConsumedCapacity).toBe('NONE')
  // })

  // it('handles invalid parameter input', () => {
  //   const { TableName } = TestEntity.putParams(
  //     { email: 'x', sort: 'y' },
  //     {},
  //     // @ts-expect-error
  //     'string'
  //   )
  //   expect(TableName).toBe('test-table')
  // })

  // TODO Create putBatch method and move tests there
  // it('formats a batch put response', async () => {
  //   const result = TestEntity.putBatch({ email: 'x', sort: 'y' })

  //   expect(result).toHaveProperty('test-table.PutRequest')
  //   expect(result['test-table'].PutRequest!.Item).toHaveProperty('_ct')
  //   expect(result['test-table'].PutRequest!.Item).toHaveProperty('_md')
  //   expect(result['test-table'].PutRequest!.Item).toHaveProperty('_et')
  //   expect(result['test-table'].PutRequest!.Item).toHaveProperty('pk')
  //   expect(result['test-table'].PutRequest!.Item).toHaveProperty('sk')
  //   expect(result['test-table'].PutRequest!.Item).toHaveProperty('test_string')
  // })

  // it('fails if no value is provided to the putBatch method', () => {
  //   // @ts-expect-error
  //   expect(() => TestEntity.putBatch()).toThrow(`'pk' or 'email' is required`)
  // })
})
