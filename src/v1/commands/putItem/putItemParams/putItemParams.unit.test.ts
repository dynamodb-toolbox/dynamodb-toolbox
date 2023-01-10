import { unmarshall } from '@aws-sdk/util-dynamodb'
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
  ComputedDefault
} from 'v1'

import { putItemParams } from './putItemParams'

const dynamoDbClient = new DynamoDBClient({})

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
  dynamoDbClient
})

const TestEntity = new EntityV2({
  name: 'TestEntity',
  item: item({
    email: string().key().savedAs('pk').required('always'),
    sort: string().key().savedAs('sk').required('always'),
    test_any: any(),
    test_binary: binary(),
    test_string: string().default('test string'),
    count: number().savedAs('test_number'),
    test_number_default: number().default(0),
    test_boolean: boolean(),
    test_list: list(string().required()),
    test_map: map({
      str: string().required()
    }),
    test_string_set: set(string().required()),
    test_number_set: set(number().required()),
    test_binary_set: set(binary().required())
  }),
  table: TestTable
})

const TestTable2 = new TableV2({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  dynamoDbClient
})

const TestEntity2 = new EntityV2({
  name: 'TestEntity2',
  item: item({
    email: string().key().required('always').savedAs('pk'),
    sort: string().savedAs('sk').default(ComputedDefault),
    test_composite: string(),
    test_composite2: string()
  }),
  computeDefaults: ({ test_composite, test_composite2, sort, ...restItem }) => ({
    test_composite,
    test_composite2,
    sort,
    ...(sort === undefined && test_composite !== undefined && test_composite2 !== undefined
      ? { sort: [test_composite, test_composite2].join('#') }
      : {}),
    ...restItem
  }),
  table: TestTable2
})

const TestEntity3 = new EntityV2({
  name: 'TestEntity3',
  item: item({
    email: string().key().required('always').savedAs('pk'),
    test: any().required(),
    test2: string()
  }),
  table: TestTable2
})

const TestTable3 = new TableV2({
  name: 'TestTable3',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  dynamoDbClient
})

const TestEntity4 = new EntityV2({
  name: 'TestEntity4',
  item: item({
    id: number().required('always').key().savedAs('pk'),
    // sk: { hidden: true, sortKey: true, default: (data: any) => data.id },
    xyz: any().savedAs('test')
  }),
  computeKey: ({ id }) => ({ pk: String(id), sk: String(id) }),
  table: TestTable3
})

const TestEntity5 = new EntityV2({
  name: 'TestEntity5',
  item: item({
    pk: string().key().required('always'),
    test_required_boolean: boolean().required(),
    test_required_number: number().required()
  }),
  table: TestTable2
})

describe('put', () => {
  it('creates basic item', () => {
    const { Item = {} } = putItemParams(TestEntity, { email: 'test-pk', sort: 'test-sk' })

    expect(unmarshall(Item)).toMatchObject({
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
    const { Item = {} } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      count: 0
    })

    expect(unmarshall(Item)).toMatchObject({ test_number: 0 })
  })

  it('creates item with overridden default override', () => {
    const overrideValue = 'different value'

    const { Item = {} } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      test_string: overrideValue
    })

    expect(unmarshall(Item)).toMatchObject({ test_string: overrideValue })
  })

  it('creates item with saved composite field', () => {
    const { Item = {} } = putItemParams(TestEntity2, {
      email: 'test-pk',
      test_composite: 'test'
    })

    expect(unmarshall(Item)).toStrictEqual({
      pk: 'test-pk',
      test_composite: 'test'
    })
  })

  it('creates item that ignores field with no value', () => {
    const { Item = {} } = putItemParams(TestEntity2, {
      email: 'test-pk',
      test_composite: undefined
    })

    expect(unmarshall(Item)).toStrictEqual({
      pk: 'test-pk'
    })
  })

  it('creates item that overrides composite key', () => {
    const { Item = {} } = putItemParams(TestEntity2, {
      email: 'test-pk',
      sort: 'override',
      test_composite: 'test',
      test_composite2: 'test2'
    })

    expect(unmarshall(Item)).toStrictEqual({
      pk: 'test-pk',
      sk: 'override',
      test_composite: 'test',
      // TODO: Make saved:false possible (as in original test)
      test_composite2: 'test2'
    })
  })

  it('creates item that generates composite key', () => {
    const { Item = {} } = putItemParams(TestEntity2, {
      email: 'test-pk',
      test_composite: 'test',
      test_composite2: 'test2'
    })

    expect(unmarshall(Item)).toStrictEqual({
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
    const { Item = {} } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      // @ts-expect-error
      unknown: '?'
    })

    expect(unmarshall(Item)).not.toHaveProperty('unknown')
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
    const { Item = {} } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      test_list: ['a', 'b']
    })

    expect(unmarshall(Item)).toMatchObject({
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
    const { Item = {} } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      test_map: {
        str: 'x'
      }
    })

    expect(unmarshall(Item)).toMatchObject({
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
    const { Item = {} } = putItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      test_string_set: new Set(['a', 'b', 'c'])
    })

    expect(unmarshall(Item)).toMatchObject({
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
    const { Item = {} } = putItemParams(TestEntity5, {
      pk: 'test-pk',
      test_required_boolean: false,
      test_required_number: 0
    })

    expect(unmarshall(Item)).toMatchObject({
      test_required_boolean: false,
      test_required_number: 0
    })
  })

  it('correctly aliases pks', () => {
    const { Item = {} } = putItemParams(TestEntity4, {
      id: 3,
      xyz: '123'
    })

    expect(unmarshall(Item)).toStrictEqual({
      pk: '3',
      sk: '3',
      test: '123'
    })
  })

  // TODO Add options in putItemParams
  // it('fails on extra options', () => {
  //   expect(() =>
  //     TestEntity.putParams(
  //       { email: 'x', sort: 'y' },
  //       // @ts-expect-error
  //       { extra: true }
  //     )
  //   ).toThrow('Invalid put options: extra')
  // })

  // it('sets capacity options', () => {
  //   const { TableName, ReturnConsumedCapacity } = TestEntity.putParams(
  //     { email: 'x', sort: 'y' },
  //     { capacity: 'none' }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(ReturnConsumedCapacity).toBe('NONE')
  // })

  // it('sets metrics options', () => {
  //   const { TableName, ReturnItemCollectionMetrics } = TestEntity.putParams(
  //     { email: 'x', sort: 'y' },
  //     { metrics: 'size' }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(ReturnItemCollectionMetrics).toBe('SIZE')
  // })

  // it('sets returnValues options', () => {
  //   const { TableName, ReturnValues } = TestEntity.putParams(
  //     { email: 'x', sort: 'y' },
  //     { returnValues: 'ALL_OLD' }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(ReturnValues).toBe('ALL_OLD')
  // })

  // it('fails on invalid capacity option', () => {
  //   expect(() => TestEntity.putParams({ email: 'x', sort: 'y' }, { capacity: 'test' })).toThrow(
  //     `'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`
  //   )
  // })

  // it('fails on invalid metrics option', () => {
  //   expect(() => TestEntity.putParams({ email: 'x', sort: 'y' }, { metrics: 'test' })).toThrow(
  //     `'metrics' must be one of 'NONE' OR 'SIZE'`
  //   )
  // })

  // it('fails on invalid returnValues option', () => {
  //   expect(() =>
  //     TestEntity.putParams(
  //       { email: 'x', sort: 'y' },
  //       // @ts-expect-error
  //       { returnValues: 'test' }
  //     )
  //   ).toThrow(
  //     `'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', or 'UPDATED_NEW'`
  //   )
  // })

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
