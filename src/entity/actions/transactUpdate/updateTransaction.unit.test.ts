import {
  $ADD,
  $GET,
  $add,
  $append,
  $delete,
  $get,
  $prepend,
  $remove,
  $set,
  $subtract,
  $sum,
  DynamoDBToolboxError,
  Entity,
  Table,
  UpdateTransaction,
  any,
  binary,
  boolean,
  item,
  list,
  map,
  number,
  prefix,
  record,
  set,
  string
} from '~/index.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' }
})

const TestEntity = new Entity({
  name: 'TestEntity',
  schema: item({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test_string_coerce: string().optional(),
    count: number().optional().savedAs('test_number'),
    test_boolean: boolean().optional(),
    test_boolean_coerce: boolean().optional(),
    test_list: list(string()).optional(),
    test_list_deep: list(map({ value: string().enum('foo', 'bar') })).optional(),
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
    touchCount: number()
      .putDefault(1)
      .updateDefault(() => $add(1))
  }).and(schema => ({
    simple_string_copy: string()
      .optional()
      .updateLink<typeof schema>(({ simple_string }) => simple_string ?? 'NOTHING_TO_COPY')
  })),
  table: TestTable
})

const TestTable2 = new Table({
  name: 'test-table2',
  partitionKey: {
    type: 'string',
    name: 'pk'
  }
})

const TestEntity2 = new Entity({
  name: 'TestEntity2',
  schema: item({
    email: string().key().savedAs('pk'),
    test: string().optional(),
    test_composite: string().optional(),
    test_composite2: string().optional(),
    test_undefined: any()
      .optional()
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

const TestTable3 = new Table({
  name: 'test-table3',
  partitionKey: { type: 'string', name: 'pk' }
})

const TestEntity3 = new Entity({
  name: 'TestEntity3',
  schema: item({
    email: string().key().savedAs('pk'),
    test: string(),
    test2: string().required('always'),
    test3: number()
  }),
  timestamps: false,
  table: TestTable3
})

const TestTable4 = new Table({
  name: 'test-table4',
  partitionKey: { type: 'string', name: 'pk' }
})

const TestEntity4 = new Entity({
  name: 'TestEntity4',
  schema: item({
    email: string().key().savedAs('pk'),
    test_number_default_with_map: number().savedAs('test_mapped_number').default(0)
  }),
  timestamps: false,
  table: TestTable4
})

const TestEntity5 = new Entity({
  name: 'TestEntity',
  schema: item({
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

describe('update transaction', () => {
  test('creates default update', () => {
    const {
      ToolboxItem,
      Update: {
        TableName,
        Key,
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues
      }
    } = TestEntity.build(UpdateTransaction).item({ email: 'test-pk', sort: 'test-sk' }).params()

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
      '#a_1': 'touchCount'
    })
    expect(ExpressionAttributeValues).toStrictEqual({
      ':s_1': 'default string',
      ':s_2': 0,
      ':s_3': false,
      ':s_4': 'NOTHING_TO_COPY',
      ':s_5': TestEntity.entityName,
      ':s_6': expect.any(String),
      ':s_7': expect.any(String),
      ':a_1': 1
    })

    expect(ToolboxItem).toStrictEqual({
      created: { [$GET]: ['created', expect.any(String)] },
      modified: expect.any(String),
      entity: { [$GET]: ['entity', TestEntity.entityName] },
      email: 'test-pk',
      sort: 'test-sk',
      simple_string_copy: 'NOTHING_TO_COPY',
      test_boolean_default: false,
      test_number_default: 0,
      test_string: 'default string',
      touchCount: { [$ADD]: 1 }
    })
  })

  test('allows overriding default field values', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
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

  test('overrides default field values that use mapping', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames }
    } = TestEntity4.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        test_number_default_with_map: 111
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1 = :s_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#s_1': 'test_mapped_number' })
  })

  test('removes fields', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames }
    } = TestEntity2.build(UpdateTransaction)
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

  test('ignores removing an invalid attribute', () => {
    const {
      Update: { ExpressionAttributeNames = {} }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'x',
        sort: 'y',
        // @ts-expect-error
        missing: $remove()
      })
      .params()

    expect(Object.values(ExpressionAttributeNames)).not.toContain('missing')
  })

  test('fails when trying to remove the partitionKey', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
        .item({
          // @ts-expect-error
          email: $remove(),
          sort: 'y'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.attributeRequired' }))
  })

  test('fails when trying to remove the sortKey', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test',
          // @ts-expect-error
          sort: $remove()
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.attributeRequired' }))
  })

  test('ignores fields with no value', () => {
    const {
      Update: { ExpressionAttributeValues = {} }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-pk',
        test_string: undefined
      })
      .params()

    const attributeValues = Object.values(ExpressionAttributeValues)

    expect(attributeValues).not.toContain('test_string')
  })

  test('accepts references', () => {
    const {
      Update: {
        UpdateExpression: UpdateExpressionA,
        ExpressionAttributeNames: ExpressionAttributeNamesA
      }
    } = TestEntity.build(UpdateTransaction)
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
      Update: {
        UpdateExpression: UpdateExpressionB,
        ExpressionAttributeNames: ExpressionAttributeNamesB,
        ExpressionAttributeValues: ExpressionAttributeValuesB
      }
    } = TestEntity.build(UpdateTransaction)
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
      Update: {
        UpdateExpression: UpdateExpressionC,
        ExpressionAttributeNames: ExpressionAttributeNamesC
      }
    } = TestEntity.build(UpdateTransaction)
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
      Update: {
        UpdateExpression: UpdateExpressionD,
        ExpressionAttributeNames: ExpressionAttributeNamesD,
        ExpressionAttributeValues: ExpressionAttributeValuesD
      }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects invalid references', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          // @ts-expect-error invalid_attribute_name is not an existing attribute name
          test_string_coerce: $get('invalid_attribute_name')
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )

    const invalidCallB = () =>
      TestEntity.build(UpdateTransaction)
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
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          // @ts-expect-error fallback must be basic value or reference
          test_number_default: $get('test_string', $add(42))
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          // @ts-expect-error invalid_attribute_name is not an existing attribute name
          test_string_coerce: $get('test_string', $get('invalid_attribute_name'))
        })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )

    const invalidCallE = () =>
      TestEntity.build(UpdateTransaction)
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

  test('performs sum update', () => {
    const {
      Update: {
        UpdateExpression: UpdateExpressionA,
        ExpressionAttributeNames: ExpressionAttributeNamesA,
        ExpressionAttributeValues: ExpressionAttributeValuesA
      }
    } = TestEntity.build(UpdateTransaction)
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
      Update: {
        UpdateExpression: UpdateExpressionB,
        ExpressionAttributeNames: ExpressionAttributeNamesB,
        ExpressionAttributeValues: ExpressionAttributeValuesB
      }
    } = TestEntity.build(UpdateTransaction)
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
      Update: {
        UpdateExpression: UpdateExpressionC,
        ExpressionAttributeNames: ExpressionAttributeNamesC,
        ExpressionAttributeValues: ExpressionAttributeValuesC
      }
    } = TestEntity.build(UpdateTransaction)
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
      Update: {
        UpdateExpression: UpdateExpressionD,
        ExpressionAttributeNames: ExpressionAttributeNamesD,
        ExpressionAttributeValues: ExpressionAttributeValuesD
      }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects invalid sum update', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateTransaction)
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
      TestEntity.build(UpdateTransaction)
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
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $sum($get('invalid_prop'), 10)
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )

    const invalidCallD = () =>
      TestEntity.build(UpdateTransaction)
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

  test('performs subtract update', () => {
    const {
      Update: {
        UpdateExpression: UpdateExpressionA,
        ExpressionAttributeNames: ExpressionAttributeNamesA,
        ExpressionAttributeValues: ExpressionAttributeValuesA
      }
    } = TestEntity.build(UpdateTransaction)
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
      Update: {
        UpdateExpression: UpdateExpressionB,
        ExpressionAttributeNames: ExpressionAttributeNamesB,
        ExpressionAttributeValues: ExpressionAttributeValuesB
      }
    } = TestEntity.build(UpdateTransaction)
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
      Update: {
        UpdateExpression: UpdateExpressionC,
        ExpressionAttributeNames: ExpressionAttributeNamesC,
        ExpressionAttributeValues: ExpressionAttributeValuesC
      }
    } = TestEntity.build(UpdateTransaction)
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
      Update: {
        UpdateExpression: UpdateExpressionD,
        ExpressionAttributeNames: ExpressionAttributeNamesD,
        ExpressionAttributeValues: ExpressionAttributeValuesD
      }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects invalid subtract update', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateTransaction)
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
      TestEntity.build(UpdateTransaction)
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
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_number_default: $subtract($get('invalid_prop'), 10)
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )

    const invalidCallD = () =>
      TestEntity.build(UpdateTransaction)
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

  test('performs number and set add updates', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects an invalid number add update', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateTransaction)
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
      TestEntity.build(UpdateTransaction)
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

  test('creates sets', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string_set: new Set(['1', '2', '3']),
        test_number_set: new Set([1, 2, 3]),
        test_binary_set: new Set([new Uint8Array([1]), new Uint8Array([2]), new Uint8Array([3])])
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
      ':s_3': new Set([new Uint8Array([1]), new Uint8Array([2]), new Uint8Array([3])])
    })
  })

  test('performs a delete update on set', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects an invalid delete update', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
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

  test('overrides existing list', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects references when setting whole list', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
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

  test('updates specific items in a list', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: { 2: 'Test2' },
        test_list_deep: { 1: { value: 'foo' } }
      })
      .params()

    expect(UpdateExpression).toContain('SET #s_1[2] = :s_1, #s_2[1].#s_3 = :s_2')
    expect(ExpressionAttributeNames).toMatchObject({
      '#s_1': 'test_list',
      '#s_2': 'test_list_deep',
      '#s_3': 'value'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':s_1': 'Test2',
      ':s_2': 'foo'
    })
  })

  test('accepts references when updating list element', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects invalid reference when updating list element', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateTransaction)
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
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )

    const invalidCallB = () =>
      TestEntity.build(UpdateTransaction)
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
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_list: {
            // @ts-expect-error fallback must be basic value or reference
            2: $get('test_string', $add(42))
          }
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestEntity.build(UpdateTransaction)
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
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )

    const invalidCallE = () =>
      TestEntity.build(UpdateTransaction)
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

  test('rejects invalid key while updating list element', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateTransaction)
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
      TestEntity.build(UpdateTransaction)
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

  test('removes items from a list', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames }
    } = TestEntity.build(UpdateTransaction)
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

  test('updates elements within a list', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
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

  test('appends data to a list', () => {
    const {
      Update: {
        UpdateExpression: UpdateExpressionA,
        ExpressionAttributeNames: ExpressionAttributeNamesA,
        ExpressionAttributeValues: ExpressionAttributeValuesA
      }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $append(['1', '2', '3'])
      })
      .params()

    expect(UpdateExpressionA).toContain('SET #s_1 = list_append(if_not_exists(#s_1, :s_1), :s_2)')
    expect(ExpressionAttributeNamesA).toMatchObject({ '#s_1': 'test_list' })
    expect(ExpressionAttributeValuesA).toMatchObject({ ':s_1': [], ':s_2': ['1', '2', '3'] })

    const {
      Update: {
        UpdateExpression: UpdateExpressionB,
        ExpressionAttributeNames: ExpressionAttributeNamesB,
        ExpressionAttributeValues: ExpressionAttributeValuesB
      }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $append($get('test_string'))
      })
      .params()

    expect(UpdateExpressionB).toContain('SET #s_1 = list_append(if_not_exists(#s_1, :s_1), #s_2)')
    expect(ExpressionAttributeNamesB).toMatchObject({ '#s_1': 'test_list', '#s_2': 'test_string' })
    expect(ExpressionAttributeValuesB).toMatchObject({ ':s_1': [] })

    const {
      Update: {
        UpdateExpression: UpdateExpressionC,
        ExpressionAttributeNames: ExpressionAttributeNamesC,
        ExpressionAttributeValues: ExpressionAttributeValuesC
      }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $append($get('test_string', ['1', '2', '3']))
      })
      .params()

    expect(UpdateExpressionC).toContain(
      'SET #s_1 = list_append(if_not_exists(#s_1, :s_1), if_not_exists(#s_2, :s_2))'
    )
    expect(ExpressionAttributeNamesC).toMatchObject({ '#s_1': 'test_list', '#s_2': 'test_string' })
    expect(ExpressionAttributeValuesC).toMatchObject({ ':s_1': [], ':s_2': ['1', '2', '3'] })
  })

  test('rejects invalid appended values', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list_deep: $append([{ value: 'foo' }, { value: 'baz' }])
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list_deep: $append($get('invalid_ref'))
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )
  })

  test('prepends data to a list', () => {
    const {
      Update: {
        UpdateExpression: UpdateExpressionA,
        ExpressionAttributeNames: ExpressionAttributeNamesA,
        ExpressionAttributeValues: ExpressionAttributeValuesA
      }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $prepend(['a', 'b', 'c'])
      })
      .params()

    expect(UpdateExpressionA).toContain('SET #s_1 = list_append(:s_1, if_not_exists(#s_1, :s_2))')
    expect(ExpressionAttributeNamesA).toMatchObject({ '#s_1': 'test_list' })
    expect(ExpressionAttributeValuesA).toMatchObject({ ':s_1': ['a', 'b', 'c'], ':s_2': [] })

    const {
      Update: {
        UpdateExpression: UpdateExpressionB,
        ExpressionAttributeNames: ExpressionAttributeNamesB,
        ExpressionAttributeValues: ExpressionAttributeValuesB
      }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $prepend($get('test_string'))
      })
      .params()

    expect(UpdateExpressionB).toContain('SET #s_1 = list_append(#s_2, if_not_exists(#s_1, :s_1))')
    expect(ExpressionAttributeNamesB).toMatchObject({ '#s_1': 'test_list', '#s_2': 'test_string' })
    expect(ExpressionAttributeValuesB).toMatchObject({ ':s_1': [] })

    const {
      Update: {
        UpdateExpression: UpdateExpressionC,
        ExpressionAttributeNames: ExpressionAttributeNamesC,
        ExpressionAttributeValues: ExpressionAttributeValuesC
      }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $prepend($get('test_string', ['1', '2', '3']))
      })
      .params()

    expect(UpdateExpressionC).toContain(
      'SET #s_1 = list_append(if_not_exists(#s_2, :s_1), if_not_exists(#s_1, :s_2))'
    )
    expect(ExpressionAttributeNamesC).toMatchObject({ '#s_1': 'test_list', '#s_2': 'test_string' })
    expect(ExpressionAttributeValuesC).toMatchObject({ ':s_1': ['1', '2', '3'], ':s_2': [] })
  })

  test('rejects invalid prepended values', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list_deep: $prepend([{ value: 'foo' }, { value: 'baz' }])
        })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallB = () =>
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list_deep: $prepend($get('invalid_ref'))
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )
  })

  test('updates deep data in a map', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
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

  test('removes deep data in a map', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames }
    } = TestEntity.build(UpdateTransaction)
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

  test('ignores undefined values', () => {
    const {
      Update: { ExpressionAttributeNames = {} }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: { optional: undefined }
      })
      .params()

    expect(Object.values(ExpressionAttributeNames)).not.toContain('test_map')
  })

  test('accepts references', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects invalid reference', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateTransaction)
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
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )

    const invalidCallB = () =>
      TestEntity.build(UpdateTransaction)
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
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_map: {
            // @ts-expect-error fallback must be basic value or reference
            optional: $get('test_number_default', $add(42))
          }
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestEntity.build(UpdateTransaction)
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
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )

    const invalidCallE = () =>
      TestEntity.build(UpdateTransaction)
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

  test('override whole map if set is used', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects references when setting whole map', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
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

  test('rejects invalid set map', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
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

  test('updates deep data in a record', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
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

  test('removes deep data in a record', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames }
    } = TestEntity.build(UpdateTransaction)
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

  test('ignores undefined values', () => {
    const {
      Update: { ExpressionAttributeNames = {} }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: { foo: undefined }
      })
      .params()

    expect(Object.values(ExpressionAttributeNames)).not.toContain('test_record')
  })

  test('accepts references', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects invalid reference', () => {
    const invalidCallA = () =>
      TestEntity.build(UpdateTransaction)
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
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )

    const invalidCallB = () =>
      TestEntity.build(UpdateTransaction)
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
      TestEntity.build(UpdateTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-pk',
          test_record: {
            // @ts-expect-error fallback must be basic value or reference
            foo: $get('test_number_default', $add(42))
          }
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))

    const invalidCallD = () =>
      TestEntity.build(UpdateTransaction)
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
      expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
    )

    const invalidCallE = () =>
      TestEntity.build(UpdateTransaction)
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

  test('override whole record if set is used', () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity.build(UpdateTransaction)
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

  test('rejects references when setting whole record', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
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

  test('rejects invalid set record', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
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

  test('rejects set on non-map or non-record attributes', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
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

  test('uses an alias', async () => {
    const {
      Update: { UpdateExpression, ExpressionAttributeNames }
    } = TestEntity.build(UpdateTransaction)
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

  test('ignores additional attribute', () => {
    const {
      Update: { ExpressionAttributeNames = {} }
    } = TestEntity.build(UpdateTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        // @ts-expect-error
        fooBar: '?'
      })
      .params()

    expect(Object.values(ExpressionAttributeNames)).not.toContain('fooBar')
  })

  test('fails when missing an "always" required field', () => {
    const invalidCall = () =>
      TestEntity3.build(UpdateTransaction)
        .item(
          // @ts-expect-error
          { email: 'test-pk' }
        )
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.attributeRequired' }))
  })

  test('sets returnValuesOnConditionFalse options', () => {
    const {
      Update: { ReturnValuesOnConditionCheckFailure }
    } = TestEntity.build(UpdateTransaction)
      .item({ email: 'x', sort: 'y' })
      .options({ returnValuesOnConditionFalse: 'ALL_OLD' })
      .params()

    expect(ReturnValuesOnConditionCheckFailure).toBe('ALL_OLD')
  })

  test('fails on invalid returnValuesOnConditionFalse option', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          returnValuesOnConditionFalse: 'ALL_NEW'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'options.invalidReturnValuesOnConditionFalseOption' })
    )
  })

  test('overrides tableName', () => {
    const {
      Update: { TableName }
    } = TestEntity.build(UpdateTransaction)
      .item({ email: 'x', sort: 'y' })
      .options({ tableName: 'tableName' })
      .params()

    expect(TableName).toBe('tableName')
  })

  test('fails on invalid tableName option', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          tableName: 42
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidTableNameOption' }))
  })

  test('fails on extra options', () => {
    const invalidCall = () =>
      TestEntity.build(UpdateTransaction)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.unknownOption' }))
  })

  test('sets conditions', () => {
    const {
      Update: { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression }
    } = TestEntity.build(UpdateTransaction)
      .item({ email: 'x', sort: 'y' })
      .options({ condition: { attr: 'email', gt: 'test' } })
      .params()

    expect(ConditionExpression).toBe('#c_1 > :c_1')
    expect(ExpressionAttributeNames).toMatchObject({ '#c_1': 'pk' })
    expect(ExpressionAttributeValues).toMatchObject({ ':c_1': 'test' })
  })

  test('missing item', () => {
    const invalidCall = () => TestEntity.build(UpdateTransaction).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  test('transformed key/attribute (partial - 1)', () => {
    const {
      Update: {
        Key,
        UpdateExpression,
        ConditionExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues
      }
    } = TestEntity5.build(UpdateTransaction)
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

  test('transformed key/attribute (partial - 2)', () => {
    const {
      Update: { Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity5.build(UpdateTransaction)
      .item({
        email: 'foo@bar.mail',
        sort: 'y',
        transformedSet: $delete(new Set(['set'])),
        transformedList: $append(['list'])
      })
      .params()

    expect(Key).toMatchObject({ pk: 'EMAIL#foo@bar.mail' })
    expect(UpdateExpression).toContain('SET #s_1 = list_append(if_not_exists(#s_1, :s_1), :s_2)')
    expect(UpdateExpression).toContain('DELETE #d_1 :d_1')
    expect(ExpressionAttributeNames).toMatchObject({
      '#d_1': 'transformedSet',
      '#s_1': 'transformedList'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':d_1': new Set(['SET#set']),
      ':s_1': [],
      ':s_2': ['LIST#list']
    })
  })

  test('transformed key/attribute (complete)', () => {
    const {
      Update: { Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
    } = TestEntity5.build(UpdateTransaction)
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
