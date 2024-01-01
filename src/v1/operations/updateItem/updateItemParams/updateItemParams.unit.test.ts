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
  record,
  DynamoDBToolboxError,
  UpdateItemCommand,
  prefix
} from 'v1'
import { $set, $get, $remove, $sum, $subtract, $add, $delete, $append, $prepend } from '../utils'

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
    test_string_coerce: string().optional(),
    count: number().optional().savedAs('test_number'),
    test_boolean: boolean().optional(),
    test_boolean_coerce: boolean().optional(),
    test_list: list(string()).optional(),
    test_list_nested: list(map({ value: string().enum('foo', 'bar') })).optional(),
    test_list_coerce: list(any()).optional(),
    test_list_required: list(any()),
    contents: map({ test: string() }).savedAs('_c'),
    test_map: map({ optional: number().enum(1, 2).optional() }),
    test_string_set: set(string()).optional(),
    test_number_set: set(number()).optional(),
    test_binary_set: set(binary()).optional(),
    test_binary: binary(),
    simple_string: string().optional(),
    test_record: record(string(), number()).optional(),
    // Put updateDefaulted attributes last to have simpler, ordered assertions
    test_string: string().optional().updateDefault('default string'),
    test_number_default: number().optional().updateDefault(0),
    test_boolean_default: boolean().optional().updateDefault(false),
    operationsCount: number()
      .putDefault(1)
      .updateDefault(() => $add(1))
  }).and(schema => ({
    simple_string_copy: string()
      .optional()
      .updateLink<typeof schema>(({ simple_string }) => simple_string ?? 'NOTHING_TO_COPY')
  })),
  table: TestTable
})

const TestTable2 = new TableV2({
  name: 'test-table2',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  documentClient
})

const TestEntity2 = new EntityV2({
  name: 'TestEntity2',
  schema: schema({
    email: string().key().savedAs('pk'),
    test: string().optional(), // TODO: prefix with test---
    test_composite: string().optional(),
    test_composite2: string().optional(),
    test_undefined: any()
      .optional()
      // TODO: use unknown
      .putDefault(() => '')
  }).and(schema => ({
    sort: string()
      .savedAs('sk')
      .optional()
      .link<typeof schema>(
        ({ test_composite, test_composite2 }) =>
          test_composite && test_composite2 && [test_composite, test_composite2].join('#')
      )
  })),
  timestamps: false,
  table: TestTable2
})

const TestTable3 = new TableV2({
  name: 'test-table3',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  documentClient
})

const TestEntity3 = new EntityV2({
  name: 'TestEntity3',
  schema: schema({
    email: string().key().savedAs('pk'),
    test: string(),
    test2: string().required('always'),
    test3: number()
  }),
  timestamps: false,
  table: TestTable3
})

const TestTable4 = new TableV2({
  name: 'test-table4',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  documentClient
})

const TestEntity4 = new EntityV2({
  name: 'TestEntity4',
  schema: schema({
    email: string().key().savedAs('pk'),
    test_number_default_with_map: number().savedAs('test_mapped_number').default(0)
  }),
  timestamps: false,
  table: TestTable4
})

const TestEntity5 = new EntityV2({
  name: 'TestEntity',
  schema: schema({
    email: string().key().savedAs('pk').transform(prefix('EMAIL')),
    sort: string().key().savedAs('sk'),
    transformedStr: string().transform(prefix('STR')),
    transformedSet: set(string().transform(prefix('SET'))),
    transformedList: list(string().transform(prefix('LIST'))),
    transformedMap: map({ str: string().transform(prefix('MAP')) }),
    transformedRecord: record(
      string().transform(prefix('RECORD_KEY')),
      string().transform(prefix('RECORD_VALUE'))
    )
  }),
  table: TestTable
})

describe('update', () => {
  it('creates default update', () => {
    const {
      TableName,
      Key,
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand).item({ email: 'test-pk', sort: 'test-sk' }).params()

    expect(TableName).toBe('test-table')
    expect(Key).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })

    expect(UpdateExpression).toStrictEqual(
      'SET #s_1 = :s_1, #s_2 = :s_2, #s_3 = :s_3, #s_4 = :s_4, #s_5 = if_not_exists(#s_6, :s_5), #s_7 = if_not_exists(#s_8, :s_6), #s_9 = :s_7 ADD #a_1 :a_1'
    )
    expect(ExpressionAttributeNames).toStrictEqual({
      '#s_1': 'test_string',
      '#s_2': 'test_number_default',
      '#s_3': 'test_boolean_default',
      '#s_4': 'simple_string_copy',
      // TODO: Re-use s5
      '#s_5': '_et',
      '#s_6': '_et',
      // TODO: Re-use s7
      '#s_7': '_ct',
      '#s_8': '_ct',
      '#s_9': '_md',
      '#a_1': 'operationsCount'
    })
    expect(ExpressionAttributeValues).toStrictEqual({
      ':s_1': 'default string',
      ':s_2': 0,
      ':s_3': false,
      ':s_4': 'NOTHING_TO_COPY',
      ':s_5': TestEntity.name,
      ':s_6': expect.any(String),
      ':s_7': expect.any(String),
      ':a_1': 1
    })
  })

  it('allows overriding default field values', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string: 'test string'
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1 = :s_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#s_1': 'test_string' })
    expect(ExpressionAttributeValues).toMatchObject({ ':s_1': 'test string' })
  })

  it('overrides default field values that use mapping', () => {
    const { UpdateExpression, ExpressionAttributeNames } = TestEntity4.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        test_number_default_with_map: 111
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1 = :s_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#s_1': 'test_mapped_number' })
  })

  it('removes fields', () => {
    const { UpdateExpression, ExpressionAttributeNames } = TestEntity2.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        test: $remove(),
        test_composite: $remove()
      })
      .params()

    expect(UpdateExpression).toContain('REMOVE #r_1, #r_2')
    expect(ExpressionAttributeNames).toMatchObject({
      '#r_1': 'test',
      '#r_2': 'test_composite'
    })
  })

  it('ignores removing an invalid attribute', () => {
    const { ExpressionAttributeNames = {} } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'x',
        sort: 'y',
        // @ts-expect-error
        missing: $remove()
      })
      .params()

    expect(Object.values(ExpressionAttributeNames)).not.toContain('missing')
  })

  it('fails when trying to remove the partitionKey', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          // @ts-expect-error
          email: $remove(),
          sort: 'y'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.attributeRequired' }))
  })

  it('fails when trying to remove the sortKey', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test',
          // @ts-expect-error
          sort: $remove()
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.attributeRequired' }))
  })

  it('ignores fields with no value', () => {
    const { ExpressionAttributeValues = {} } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-pk',
        test_string: undefined
      })
      .params()

    const attributeValues = Object.values(ExpressionAttributeValues)

    expect(attributeValues).not.toContain('test_string')
  })

  it('accepts references', () => {
    const {
      UpdateExpression: UpdateExpressionA,
      ExpressionAttributeNames: ExpressionAttributeNamesA
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-pk',
        test_string_coerce: $get('test_string')
      })
      .params()

    expect(UpdateExpressionA).toContain('SET #s_1 = #s_2')
    expect(ExpressionAttributeNamesA).toMatchObject({
      '#s_1': 'test_string_coerce',
      '#s_2': 'test_string'
    })

    const {
      UpdateExpression: UpdateExpressionB,
      ExpressionAttributeNames: ExpressionAttributeNamesB,
      ExpressionAttributeValues: ExpressionAttributeValuesB
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-pk',
        test_string_coerce: $get('test_string', 'foo')
      })
      .params()

    expect(UpdateExpressionB).toContain('SET #s_1 = if_not_exists(#s_2, :s_1)')
    expect(ExpressionAttributeNamesB).toMatchObject({
      '#s_1': 'test_string_coerce',
      '#s_2': 'test_string'
    })
    expect(ExpressionAttributeValuesB).toMatchObject({ ':s_1': 'foo' })

    const {
      UpdateExpression: UpdateExpressionC,
      ExpressionAttributeNames: ExpressionAttributeNamesC
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-pk',
        test_string_coerce: $get('test_string', $get('simple_string'))
      })
      .params()

    expect(UpdateExpressionC).toContain('SET #s_1 = if_not_exists(#s_2, #s_3)')
    expect(ExpressionAttributeNamesC).toMatchObject({
      '#s_1': 'test_string_coerce',
      '#s_2': 'test_string',
      '#s_3': 'simple_string'
    })

    const {
      UpdateExpression: UpdateExpressionD,
      ExpressionAttributeNames: ExpressionAttributeNamesD,
      ExpressionAttributeValues: ExpressionAttributeValuesD
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-pk',
        test_string_coerce: $get('test_string', $get('simple_string', 'bar'))
      })
      .params()

    expect(UpdateExpressionD).toContain('SET #s_1 = if_not_exists(#s_2, if_not_exists(#s_3, :s_1))')
    expect(ExpressionAttributeNamesD).toMatchObject({
      '#s_1': 'test_string_coerce',
      '#s_2': 'test_string',
      '#s_3': 'simple_string'
    })
    expect(ExpressionAttributeValuesD).toMatchObject({ ':s_1': 'bar' })
  })

  it('rejects invalid references', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          // @ts-expect-error invalid_attribute_name is not an existing attribute name
          test_string_coerce: $get('invalid_attribute_name')
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )

    const invalidCallB = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          // @ts-expect-error 42 is not assignable to test_string_coerce
          test_string_coerce: $get('test_string', 42)
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallC = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          // @ts-expect-error $get is only available in SET operations
          test_number_default: $get('test_string', $add(42))
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          // @ts-expect-error invalid_attribute_name is not an existing attribute name
          test_string_coerce: $get('test_string', $get('invalid_attribute_name'))
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )

    const invalidCallE = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          // @ts-expect-error 42 is not assignable to test_string_coerce
          test_string_coerce: $get('test_string', $get('simple_string', 42))
        })
        .params()

    expect(invalidCallE).toThrow(DynamoDBToolboxError)
    expect(invalidCallE).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('performs sum operation', () => {
    const {
      UpdateExpression: UpdateExpressionA,
      ExpressionAttributeNames: ExpressionAttributeNamesA,
      ExpressionAttributeValues: ExpressionAttributeValuesA
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $sum(10, 10)
      })
      .params()

    /**
     * @debt test "We get some noise due to update defaults. Use case specific Entity."
     */
    expect(UpdateExpressionA).toContain('SET #s_1 = :s_1, #s_2 = :s_2 + :s_3')
    expect(ExpressionAttributeNamesA).toMatchObject({ '#s_2': 'test_number_default' })
    expect(ExpressionAttributeValuesA).toMatchObject({ ':s_2': 10, ':s_3': 10 })

    const {
      UpdateExpression: UpdateExpressionB,
      ExpressionAttributeNames: ExpressionAttributeNamesB,
      ExpressionAttributeValues: ExpressionAttributeValuesB
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $sum($get('count'), 10)
      })
      .params()

    expect(UpdateExpressionB).toContain('SET #s_1 = :s_1, #s_2 = #s_3 + :s_2')
    expect(ExpressionAttributeNamesB).toMatchObject({
      '#s_2': 'test_number_default',
      // TODO: Use a non re-mapped property
      '#s_3': 'test_number'
    })
    expect(ExpressionAttributeValuesB).toMatchObject({ ':s_2': 10 })

    const {
      UpdateExpression: UpdateExpressionC,
      ExpressionAttributeNames: ExpressionAttributeNamesC,
      ExpressionAttributeValues: ExpressionAttributeValuesC
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $sum(10, $get('count', 10))
      })
      .params()

    expect(UpdateExpressionC).toContain('SET #s_1 = :s_1, #s_2 = :s_2 + if_not_exists(#s_3, :s_3)')
    expect(ExpressionAttributeNamesC).toMatchObject({
      '#s_2': 'test_number_default',
      // TODO: Use a non re-mapped property
      '#s_3': 'test_number'
    })
    expect(ExpressionAttributeValuesC).toMatchObject({ ':s_2': 10, ':s_3': 10 })

    const {
      UpdateExpression: UpdateExpressionD,
      ExpressionAttributeNames: ExpressionAttributeNamesD,
      ExpressionAttributeValues: ExpressionAttributeValuesD
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $sum($get('count', 5), $get('count', 10))
      })
      .params()

    expect(UpdateExpressionD).toContain(
      'SET #s_1 = :s_1, #s_2 = if_not_exists(#s_3, :s_2) + if_not_exists(#s_4, :s_3)'
    )
    expect(ExpressionAttributeNamesD).toMatchObject({
      '#s_2': 'test_number_default',
      // TODO: Use a non re-mapped property
      '#s_3': 'test_number'
    })
    expect(ExpressionAttributeValuesD).toMatchObject({ ':s_2': 5, ':s_3': 10 })
  })

  it('rejects invalid sum operation', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $sum('a', 10)
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $sum(10, '10')
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallC = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $sum($get('invalid_prop'), 10)
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )

    const invalidCallD = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $sum(10, $get('count', '10'))
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('performs subtract operation', () => {
    const {
      UpdateExpression: UpdateExpressionA,
      ExpressionAttributeNames: ExpressionAttributeNamesA,
      ExpressionAttributeValues: ExpressionAttributeValuesA
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $subtract(10, 10)
      })
      .params()

    /**
     * @debt test "We get some noise due to update defaults. Use case specific Entity."
     */
    expect(UpdateExpressionA).toContain('SET #s_1 = :s_1, #s_2 = :s_2 - :s_3')
    expect(ExpressionAttributeNamesA).toMatchObject({ '#s_2': 'test_number_default' })
    expect(ExpressionAttributeValuesA).toMatchObject({ ':s_2': 10, ':s_3': 10 })

    const {
      UpdateExpression: UpdateExpressionB,
      ExpressionAttributeNames: ExpressionAttributeNamesB,
      ExpressionAttributeValues: ExpressionAttributeValuesB
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $subtract($get('count'), 10)
      })
      .params()

    expect(UpdateExpressionB).toContain('SET #s_1 = :s_1, #s_2 = #s_3 - :s_2')
    expect(ExpressionAttributeNamesB).toMatchObject({
      '#s_2': 'test_number_default',
      // TODO: Use a non re-mapped property
      '#s_3': 'test_number'
    })
    expect(ExpressionAttributeValuesB).toMatchObject({ ':s_2': 10 })

    const {
      UpdateExpression: UpdateExpressionC,
      ExpressionAttributeNames: ExpressionAttributeNamesC,
      ExpressionAttributeValues: ExpressionAttributeValuesC
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $subtract(10, $get('count', 10))
      })
      .params()

    expect(UpdateExpressionC).toContain('SET #s_1 = :s_1, #s_2 = :s_2 - if_not_exists(#s_3, :s_3)')
    expect(ExpressionAttributeNamesC).toMatchObject({
      '#s_2': 'test_number_default',
      // TODO: Use a non re-mapped property
      '#s_3': 'test_number'
    })
    expect(ExpressionAttributeValuesC).toMatchObject({ ':s_3': 10 })

    const {
      UpdateExpression: UpdateExpressionD,
      ExpressionAttributeNames: ExpressionAttributeNamesD,
      ExpressionAttributeValues: ExpressionAttributeValuesD
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $subtract($get('count', 5), $get('count', 10))
      })
      .params()

    expect(UpdateExpressionD).toContain(
      'SET #s_1 = :s_1, #s_2 = if_not_exists(#s_3, :s_2) - if_not_exists(#s_4, :s_3)'
    )
    expect(ExpressionAttributeNamesD).toMatchObject({
      '#s_2': 'test_number_default',
      // TODO: Use a non re-mapped property
      '#s_3': 'test_number'
    })
    expect(ExpressionAttributeValuesD).toMatchObject({ ':s_2': 5, ':s_3': 10 })
  })

  it('rejects invalid subtract operation', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $subtract('a', 10)
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $subtract(10, '10')
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallC = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $subtract($get('invalid_prop'), 10)
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )

    const invalidCallD = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $subtract(10, $get('count', '10'))
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('performs number and set add operations', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $add(10),
        test_number_set: $add(new Set([1, 2, 3]))
      })
      .params()

    expect(UpdateExpression).toContain('ADD #a_1 :a_1, #a_2 :a_2')
    expect(ExpressionAttributeNames).toMatchObject({
      '#a_1': 'test_number_set',
      '#a_2': 'test_number_default'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':a_1': new Set([1, 2, 3]),
      ':a_2': 10
    })
  })

  it('rejects an invalid number add operation', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_string: $add(10)
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $delete(10)
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('creates sets', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string_set: new Set(['1', '2', '3']),
        test_number_set: new Set([1, 2, 3]),
        test_binary_set: new Set([Buffer.from('1'), Buffer.from('2'), Buffer.from('3')])
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1 = :s_1, #s_2 = :s_2, #s_3 = :s_3')
    expect(ExpressionAttributeNames).toMatchObject({
      '#s_1': 'test_string_set',
      '#s_2': 'test_number_set',
      '#s_3': 'test_binary_set'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':s_1': new Set(['1', '2', '3']),
      ':s_2': new Set([1, 2, 3]),
      ':s_3': new Set([Buffer.from('1'), Buffer.from('2'), Buffer.from('3')])
    })
  })

  it('performs a delete operation on set', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string_set: $delete(new Set(['1', '2', '3'])),
        test_number_set: $delete(new Set([1, 2, 3]))
      })
      .params()

    expect(UpdateExpression).toContain('DELETE #d_1 :d_1, #d_2 :d_2')
    expect(ExpressionAttributeNames).toMatchObject({
      '#d_1': 'test_string_set',
      '#d_2': 'test_number_set'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':d_1': new Set(['1', '2', '3']),
      ':d_2': new Set([1, 2, 3])
    })
  })

  it('rejects an invalid delete operation', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_string: $delete(10)
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('overrides existing list', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $set(['test1', 'test2'])
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1 = :s_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#s_1': 'test_list' })
    expect(ExpressionAttributeValues).toMatchObject({ ':s_1': ['test1', 'test2'] })
  })

  it('rejects references when setting whole list', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list: $set([$get('test_string'), 'test2'])
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('updates specific items in a list', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: { 2: 'Test2' },
        test_list_nested: { 1: { value: 'foo' } }
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1[2] = :s_1, #s_2[1].#s_3 = :s_2')
    expect(ExpressionAttributeNames).toMatchObject({
      '#s_1': 'test_list',
      '#s_2': 'test_list_nested',
      '#s_3': 'value'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':s_1': 'Test2',
      ':s_2': 'foo'
    })
  })

  it('accepts references when updating list element', () => {
    const { UpdateExpression, ExpressionAttributeNames } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: { 2: $get('test_string') }
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1[2] = #s_2')
    expect(ExpressionAttributeNames).toMatchObject({
      '#s_1': 'test_list',
      '#s_2': 'test_string'
    })
  })

  it('rejects invalid reference when updating list element', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          test_list: {
            // @ts-expect-error invalid_ref is not a valid attribute
            2: $get('invalid_ref')
          }
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )

    const invalidCallB = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_list: {
            // @ts-expect-error 42 is not assignable to string
            2: $get('test_string', 42)
          }
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallC = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_list: {
            // @ts-expect-error $get is only available in SET operations
            2: $get('test_string', $add(42))
          }
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_list: {
            // @ts-expect-error invalid_attribute_name is not an existing attribute name
            2: $get('test_string', $get('invalid_attribute_name'))
          }
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )

    const invalidCallE = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_list: {
            // @ts-expect-error 42 is not assignable to string
            2: $get('test_string', $get('simple_string', 42))
          }
        })
        .params()

    expect(invalidCallE).toThrow(DynamoDBToolboxError)
    expect(invalidCallE).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('rejects invalid key while updating list element', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          test_list: {
            // @ts-expect-error
            foo: 'Test2'
          }
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          test_list: {
            // TS unable to detect integers
            1.5: 'Test2'
          }
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('removes items from a list', () => {
    const { UpdateExpression, ExpressionAttributeNames } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: {
          2: $remove()
        }
      })
      .params()

    expect(UpdateExpression).toContain('REMOVE #r_1[2]')
    expect(ExpressionAttributeNames).toMatchObject({ '#r_1': 'test_list' })
  })

  it('updates elements within a list', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: [undefined, $remove(), 'test']
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1[2] = :s_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#s_1': 'test_list' })
    expect(ExpressionAttributeValues).toMatchObject({ ':s_1': 'test' })

    expect(UpdateExpression).toContain('REMOVE #r_1[1]')
    expect(ExpressionAttributeNames).toMatchObject({ '#r_1': 'test_list' })
  })

  it('appends data to a list', () => {
    const {
      UpdateExpression: UpdateExpressionA,
      ExpressionAttributeNames: ExpressionAttributeNamesA,
      ExpressionAttributeValues: ExpressionAttributeValuesA
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $append(['1', '2', '3'])
      })
      .params()

    expect(UpdateExpressionA).toContain('SET #s_1 = list_append(#s_1, :s_1)')
    expect(ExpressionAttributeNamesA).toMatchObject({ '#s_1': 'test_list' })
    expect(ExpressionAttributeValuesA).toMatchObject({ ':s_1': ['1', '2', '3'] })

    const {
      UpdateExpression: UpdateExpressionB,
      ExpressionAttributeNames: ExpressionAttributeNamesB
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $append($get('test_string'))
      })
      .params()

    expect(UpdateExpressionB).toContain('SET #s_1 = list_append(#s_1, #s_2)')
    expect(ExpressionAttributeNamesB).toMatchObject({ '#s_1': 'test_list', '#s_2': 'test_string' })

    const {
      UpdateExpression: UpdateExpressionC,
      ExpressionAttributeNames: ExpressionAttributeNamesC,
      ExpressionAttributeValues: ExpressionAttributeValuesC
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $append($get('test_string', ['1', '2', '3']))
      })
      .params()

    expect(UpdateExpressionC).toContain('SET #s_1 = list_append(#s_1, if_not_exists(#s_2, :s_1))')
    expect(ExpressionAttributeNamesC).toMatchObject({ '#s_1': 'test_list', '#s_2': 'test_string' })
    expect(ExpressionAttributeValuesC).toMatchObject({ ':s_1': ['1', '2', '3'] })
  })

  it('rejects invalid appended values', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list_nested: $append([{ value: 'foo' }, { value: 'baz' }])
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list_nested: $append($get('invalid_ref'))
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )
  })

  it('prepends data to a list', () => {
    const {
      UpdateExpression: UpdateExpressionA,
      ExpressionAttributeNames: ExpressionAttributeNamesA,
      ExpressionAttributeValues: ExpressionAttributeValuesA
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $prepend(['a', 'b', 'c'])
      })
      .params()

    expect(UpdateExpressionA).toContain('SET #s_1 = list_append(:s_1, #s_1)')
    expect(ExpressionAttributeNamesA).toMatchObject({ '#s_1': 'test_list' })
    expect(ExpressionAttributeValuesA).toMatchObject({ ':s_1': ['a', 'b', 'c'] })

    const {
      UpdateExpression: UpdateExpressionB,
      ExpressionAttributeNames: ExpressionAttributeNamesB
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $prepend($get('test_string'))
      })
      .params()

    expect(UpdateExpressionB).toContain('SET #s_1 = list_append(#s_2, #s_1)')
    expect(ExpressionAttributeNamesB).toMatchObject({ '#s_1': 'test_list', '#s_2': 'test_string' })

    const {
      UpdateExpression: UpdateExpressionC,
      ExpressionAttributeNames: ExpressionAttributeNamesC,
      ExpressionAttributeValues: ExpressionAttributeValuesC
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $prepend($get('test_string', ['1', '2', '3']))
      })
      .params()

    expect(UpdateExpressionC).toContain('SET #s_1 = list_append(if_not_exists(#s_2, :s_1), #s_1)')
    expect(ExpressionAttributeNamesC).toMatchObject({ '#s_1': 'test_list', '#s_2': 'test_string' })
    expect(ExpressionAttributeValuesC).toMatchObject({ ':s_1': ['1', '2', '3'] })
  })

  it('rejects invalid prepended values', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list_nested: $prepend([{ value: 'foo' }, { value: 'baz' }])
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list_nested: $prepend($get('invalid_ref'))
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )
  })

  it('updates nested data in a map', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: { optional: 1 }
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1.#s_2 = :s_1')
    expect(ExpressionAttributeNames).toMatchObject({
      '#s_1': 'test_map',
      '#s_2': 'optional'
    })
    expect(ExpressionAttributeValues).toMatchObject({ ':s_1': 1 })
  })

  it('removes nested data in a map', () => {
    const { UpdateExpression, ExpressionAttributeNames } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: { optional: $remove() }
      })
      .params()

    expect(UpdateExpression).toContain('REMOVE #r_1.#r_2')
    expect(ExpressionAttributeNames).toMatchObject({
      '#r_1': 'test_map',
      '#r_2': 'optional'
    })
  })

  it('ignores undefined values', () => {
    const { ExpressionAttributeNames = {} } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: { optional: undefined }
      })
      .params()

    expect(Object.values(ExpressionAttributeNames)).not.toContain('test_map')
  })

  it('accepts references', () => {
    const { UpdateExpression, ExpressionAttributeNames } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: { optional: $get('test_number_default') }
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1.#s_2 = #s_3')
    expect(ExpressionAttributeNames).toMatchObject({
      '#s_1': 'test_map',
      '#s_2': 'optional',
      '#s_3': 'test_number_default'
    })
  })

  it('rejects invalid reference', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          test_map: {
            // @ts-expect-error invalid_attribute_name is not an existing attribute name
            optional: $get('invalid_attribute_name')
          }
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )

    const invalidCallB = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_map: {
            // @ts-expect-error 42 is not assignable to 1 | 2
            optional: $get('test_number_default', 42)
          }
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallC = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_map: {
            // @ts-expect-error $get is only available in SET operations
            optional: $get('test_number_default', $add(42))
          }
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_map: {
            // @ts-expect-error invalid_attribute_name is not an existing attribute name
            optional: $get('test_number_default', $get('invalid_attribute_name'))
          }
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )

    const invalidCallE = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_map: {
            // @ts-expect-error 42 is not assignable to 1 | 2
            optional: $get('test_number_default', $get('test_number_default', 42))
          }
        })
        .params()

    expect(invalidCallE).toThrow(DynamoDBToolboxError)
    expect(invalidCallE).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('override whole map if set is used', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: $set({ optional: 1 })
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1 = :s_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#s_1': 'test_map' })
    expect(ExpressionAttributeValues).toMatchObject({ ':s_1': { optional: 1 } })
  })

  it('rejects references when setting whole map', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_map: $set({
            optional: $get('test_string')
          })
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('rejects invalid set map', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_map: $set({
            optional: $add(1)
          })
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('updates nested data in a record', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: { foo: 1 }
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1.#s_2 = :s_1')
    expect(ExpressionAttributeNames).toMatchObject({
      '#s_1': 'test_record',
      '#s_2': 'foo'
    })
    expect(ExpressionAttributeValues).toMatchObject({ ':s_1': 1 })
  })

  it('removes nested data in a record', () => {
    const { UpdateExpression, ExpressionAttributeNames } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: { foo: $remove() }
      })
      .params()

    expect(UpdateExpression).toContain('REMOVE #r_1.#r_2')
    expect(ExpressionAttributeNames).toMatchObject({
      '#r_1': 'test_record',
      '#r_2': 'foo'
    })
  })

  it('ignores undefined values', () => {
    const { ExpressionAttributeNames = {} } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: { foo: undefined }
      })
      .params()

    expect(Object.values(ExpressionAttributeNames)).not.toContain('test_record')
  })

  it('accepts references', () => {
    const { UpdateExpression, ExpressionAttributeNames } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: { foo: $get('test_number_default') }
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1.#s_2 = #s_3')
    expect(ExpressionAttributeNames).toMatchObject({
      '#s_1': 'test_record',
      '#s_2': 'foo',
      '#s_3': 'test_number_default'
    })
  })

  it('rejects invalid reference', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          test_record: {
            // @ts-expect-error invalid_attribute_name is not an existing attribute name
            foo: $get('invalid_attribute_name')
          }
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )

    const invalidCallB = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_record: {
            // @ts-expect-error 'foo' is not assignable to number
            foo: $get('test_number_default', 'foo')
          }
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallC = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_record: {
            // @ts-expect-error $get is only available in SET operations
            foo: $get('test_number_default', $add(42))
          }
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_record: {
            // @ts-expect-error invalid_attribute_name is not an existing attribute name
            foo: $get('test_number_default', $get('invalid_attribute_name'))
          }
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(
      expect.objectContaining({ code: 'operations.invalidExpressionAttributePath' })
    )

    const invalidCallE = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_record: {
            // @ts-expect-error 'foo" is not assignable to number
            foo: $get('test_number_default', $get('test_number_default', 'foo'))
          }
        })
        .params()

    expect(invalidCallE).toThrow(DynamoDBToolboxError)
    expect(invalidCallE).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('override whole record if set is used', () => {
    const {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: $set({ foo: 1 })
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1 = :s_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#s_1': 'test_record' })
    expect(ExpressionAttributeValues).toMatchObject({ ':s_1': { foo: 1 } })
  })

  it('rejects references when setting whole record', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_record: $set({
            foo: $get('test_string')
          })
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('rejects invalid set record', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_record: $set({
            foo: $add(1)
          })
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('rejects set on non-map or non-record attributes', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_string: $set('test')
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  /**
   * @debt TODO "Test anyOf attribute"
   */

  it('uses an alias', async () => {
    const { UpdateExpression, ExpressionAttributeNames } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test@test.com',
        sort: 'test-sk',
        count: $add(10),
        contents: { test: 'test' }
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1.#s_2 = :s_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#s_1': '_c' })

    expect(UpdateExpression).toContain('ADD #a_1 :a_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#a_1': 'test_number' })
  })

  it('ignores additional attribute', () => {
    const { ExpressionAttributeNames = {} } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        // @ts-expect-error
        fooBar: '?'
      })
      .params()

    expect(Object.values(ExpressionAttributeNames)).not.toContain('fooBar')
  })

  it('fails when missing an "always" required field', () => {
    const invalidCall = () =>
      TestEntity3.build(UpdateItemCommand)
        .item(
          // @ts-expect-error
          { email: 'test-pk' }
        )
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.attributeRequired' }))
  })

  it('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestEntity.build(UpdateItemCommand)
      .item({ email: 'x', sort: 'y' })
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('sets metrics options', () => {
    const { ReturnItemCollectionMetrics } = TestEntity.build(UpdateItemCommand)
      .item({ email: 'x', sort: 'y' })
      .options({ metrics: 'SIZE' })
      .params()

    expect(ReturnItemCollectionMetrics).toBe('SIZE')
  })

  it('sets returnValues options', () => {
    const { ReturnValues } = TestEntity.build(UpdateItemCommand)
      .item({ email: 'x', sort: 'y' })
      .options({ returnValues: 'ALL_OLD' })
      .params()

    expect(ReturnValues).toBe('ALL_OLD')
  })

  it('fails on invalid capacity option', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({ email: 'x', sort: 'y' })
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

  it('fails on invalid metrics option', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          metrics: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'operations.invalidMetricsOption' })
    )
  })

  it('fails on invalid returnValues option', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          returnValues: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'operations.invalidReturnValuesOption' })
    )
  })

  it('fails on extra options', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateItemCommand)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.unknownOption' }))
  })

  it('sets conditions', () => {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = TestEntity.build(UpdateItemCommand)
      .item({ email: 'x', sort: 'y' })
      .options({ condition: { attr: 'email', gt: 'test' } })
      .params()

    expect(ConditionExpression).toBe('#c_1 > :c_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#c_1': 'pk' })
    expect(ExpressionAttributeValues).toMatchObject({ ':c_1': 'test' })
  })

  it('missing item', () => {
    const invalidCall = () => TestEntity.build(UpdateItemCommand).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.incompleteCommand' }))
  })

  fit('transformed key/attribute (partial - 1)', () => {
    const {
      Key,
      UpdateExpression,
      ConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity5.build(UpdateItemCommand)
      .item({
        email: 'foo@bar.mail',
        sort: 'y',
        transformedSet: $add(new Set(['set'])),
        transformedList: ['list'],
        transformedMap: { str: 'map' },
        transformedRecord: { recordKey: 'recordValue' }
      })
      .options({
        condition: {
          and: [
            { attr: 'email', eq: 'test' },
            { attr: 'transformedStr', eq: 'str' },
            /**
             * @debt feature "Can you apply Contains clauses to Set attributes?"
             */
            // { attr: 'transformedSet', contains: 'SET' }
            { attr: 'transformedMap.str', eq: 'map' },
            { attr: 'transformedRecord.key', eq: 'value' }
          ]
        }
      })
      .params()

    expect(Key).toMatchObject({ pk: 'EMAIL#foo@bar.mail' })
    expect(UpdateExpression).toContain('SET #s_1[0] = :s_1, #s_2.#s_3 = :s_2, #s_4.#s_5 = :s_3')
    expect(UpdateExpression).toContain('ADD #a_1 :a_1')
    expect(ExpressionAttributeNames).toMatchObject({
      '#s_1': 'transformedList',
      '#s_2': 'transformedMap',
      '#s_3': 'str',
      '#s_4': 'transformedRecord',
      '#s_5': 'RECORD_KEY#recordKey',
      '#a_1': 'transformedSet'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':s_1': 'LIST#list',
      ':s_2': 'MAP#map',
      ':s_3': 'RECORD_VALUE#recordValue',
      ':a_1': new Set(['SET#set'])
    })

    expect(ConditionExpression).toBe(
      '(#c_1 = :c_1) AND (#c_2 = :c_2) AND (#c_3.#c_4 = :c_3) AND (#c_5.#c_6 = :c_4)'
    )
    expect(ExpressionAttributeNames).toMatchObject({
      '#c_1': 'pk',
      '#c_2': 'transformedStr',
      '#c_3': 'transformedMap',
      '#c_4': 'str',
      '#c_5': 'transformedRecord',
      '#c_6': 'RECORD_KEY#key'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':a_1': new Set(['SET#set']),
      ':c_1': 'EMAIL#test',
      ':c_2': 'STR#str',
      ':c_3': 'MAP#map',
      ':c_4': 'RECORD_VALUE#value'
    })
  })

  it('transformed key/attribute (partial - 2)', () => {
    const {
      Key,
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity5.build(UpdateItemCommand)
      .item({
        email: 'foo@bar.mail',
        sort: 'y',
        transformedSet: $delete(new Set(['set'])),
        transformedList: $append(['list'])
      })
      .params()

    expect(Key).toMatchObject({ pk: 'EMAIL#foo@bar.mail' })
    expect(UpdateExpression).toContain('SET #s_1 = list_append(#s_1, :s_1)')
    expect(UpdateExpression).toContain('DELETE #d_1 :d_1')
    expect(ExpressionAttributeNames).toMatchObject({
      '#d_1': 'transformedSet',
      '#s_1': 'transformedList'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':d_1': new Set(['SET#set']),
      ':s_1': ['LIST#list']
    })
  })

  it('transformed key/attribute (complete)', () => {
    const {
      Key,
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    } = TestEntity5.build(UpdateItemCommand)
      .item({
        email: 'foo@bar.mail',
        sort: 'y',
        transformedSet: new Set(['set']),
        transformedList: $set(['list']),
        transformedMap: $set({ str: 'map' }),
        transformedRecord: $set({ recordKey: 'recordValue' })
      })
      .params()

    expect(Key).toMatchObject({ pk: 'EMAIL#foo@bar.mail' })
    expect(UpdateExpression).toContain('SET #s_1 = :s_1, #s_2 = :s_2, #s_3 = :s_3, #s_4 = :s_4')
    expect(ExpressionAttributeNames).toMatchObject({
      '#s_1': 'transformedSet',
      '#s_2': 'transformedList',
      '#s_3': 'transformedMap',
      '#s_4': 'transformedRecord'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':s_1': new Set(['SET#set']),
      ':s_2': ['LIST#list'],
      ':s_3': {
        str: 'MAP#map'
      },
      ':s_4': {
        'RECORD_KEY#recordKey': 'RECORD_VALUE#recordValue'
      }
    })
  })
})
