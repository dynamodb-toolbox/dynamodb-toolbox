import {
  DynamoDBToolboxError,
  Entity,
  PutItemCommand,
  Table,
  any,
  anyOf,
  binary,
  boolean,
  list,
  map,
  nul,
  number,
  prefix,
  record,
  schema,
  set,
  string
} from '~/index.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  sortKey: {
    type: 'string',
    name: 'sk'
  }
})

const TestEntity = new Entity({
  name: 'TestEntity',
  schema: schema({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test_any: any().optional(),
    test_boolean: boolean().optional(),
    test_number_defaulted: number().putDefault(0),
    test_string: string().putDefault('test string'),
    test_binary: binary().optional(),
    count: number().optional().savedAs('test_number'),
    test_list: list(string()).optional(),
    test_map: map({
      str: string()
    }).optional(),
    test_string_set: set(string()).optional(),
    test_number_set: set(number()).optional(),
    test_binary_set: set(binary()).optional(),
    test_nullable_string: anyOf(string(), nul()).optional()
  }).and(baseSchema => ({
    test_string_2: string().putLink<typeof baseSchema>(({ test_string }) => test_string)
  })),
  table: TestTable
})

const TestTable2 = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' }
})

const TestEntity2 = new Entity({
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

const TestEntity3 = new Entity({
  name: 'TestEntity3',
  schema: schema({
    email: string().key().savedAs('pk'),
    test: any(),
    test2: string().optional()
  }),
  table: TestTable2
})

const TestTable3 = new Table({
  name: 'TestTable3',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' }
})

const TestEntity4 = new Entity({
  name: 'TestEntity4',
  schema: schema({
    id: number().key().savedAs('pk'),
    // sk: { hidden: true, sortKey: true, default: (data: any) => data.id },
    xyz: any().optional().savedAs('test')
  }),
  computeKey: ({ id }) => ({ pk: String(id), sk: String(id) }),
  table: TestTable3
})

const TestEntity5 = new Entity({
  name: 'TestEntity5',
  schema: schema({
    pk: string().key(),
    test_required_boolean: boolean(),
    test_required_number: number()
  }),
  table: TestTable2
})

describe('put', () => {
  test('creates basic item', () => {
    const { Item } = TestEntity.build(PutItemCommand)
      .item({ email: 'test-pk', sort: 'test-sk' })
      .params()

    expect(Item).toMatchObject({
      _et: TestEntity.name,
      _ct: expect.any(String),
      _md: expect.any(String),
      pk: 'test-pk',
      sk: 'test-sk',
      test_string: 'test string',
      // Defaults are filled before links
      test_string_2: 'test string',
      test_number_defaulted: 0
    })
  })

  test('creates item with aliases', () => {
    const { Item } = TestEntity.build(PutItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        count: 0
      })
      .params()

    expect(Item).toMatchObject({ test_number: 0 })
  })

  test('creates item with overridden default override', () => {
    const overrideValue = 'different value'

    const { Item } = TestEntity.build(PutItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string: overrideValue
      })
      .params()

    expect(Item).toMatchObject({ test_string: overrideValue })
  })

  test('creates item with composite field', () => {
    const { Item } = TestEntity2.build(PutItemCommand)
      .item({
        email: 'test-pk',
        test_composite: 'test'
      })
      .params()

    expect(Item).not.toHaveProperty('sort')
  })

  test('creates item with filled composite key', () => {
    const { Item } = TestEntity2.build(PutItemCommand)
      .item({
        email: 'test-pk',
        test_composite: 'test',
        test_composite2: 'test2'
      })
      .params()

    expect(Item).toMatchObject({ sk: 'test#test2' })
  })

  test('creates item with overriden composite key', () => {
    const { Item } = TestEntity2.build(PutItemCommand)
      .item({
        email: 'test-pk',
        sort: 'override',
        test_composite: 'test',
        test_composite2: 'test2'
      })
      .params()

    expect(Item).toMatchObject({ sk: 'override' })
  })

  test('fails if required attribute misses', () => {
    expect(() =>
      TestEntity3.build(PutItemCommand)
        .item(
          // @ts-expect-error
          { email: 'test-pk' }
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('ignores additional attribute', () => {
    const { Item } = TestEntity.build(PutItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        // @ts-expect-error
        unknown: '?'
      })
      .params()

    expect(Item).not.toHaveProperty('unknown')
  })

  test('fails when invalid string provided with no coercion', () => {
    expect(() =>
      TestEntity.build(PutItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_string: 1
        })
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when invalid boolean provided with no coercion', () => {
    expect(() =>
      TestEntity.build(PutItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_boolean: 'x'
        })
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when invalid number provided with no coercion', () => {
    expect(() =>
      TestEntity.build(PutItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          count: 'x'
        })
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when null provided to non-nullable attribute', () => {
    expect(() =>
      TestEntity.build(PutItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_string: null
        })
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('acceps null provided to nullable attribute', () => {
    const { Item } = TestEntity.build(PutItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_nullable_string: null
      })
      .params()

    expect(Item).toMatchObject({ test_nullable_string: null })
  })

  test('with valid array', () => {
    const { Item } = TestEntity.build(PutItemCommand)
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

  test('fails when invalid array provided', () => {
    expect(() =>
      TestEntity.build(PutItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_list: ['a', 2]
        })
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('with valid map', () => {
    const { Item } = TestEntity.build(PutItemCommand)
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

  test('fails when invalid map provided', () => {
    expect(() =>
      TestEntity.build(PutItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_map: { str: 2 }
        })
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('with valid set', () => {
    const { Item } = TestEntity.build(PutItemCommand)
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

  test('fails when set contains different types', () => {
    expect(() =>
      TestEntity.build(PutItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          test_string_set: new Set(['a', 'b', 3])
        })
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when missing a required field', () => {
    expect(() =>
      TestEntity3.build(PutItemCommand)
        .item(
          // @ts-expect-error
          { email: 'test-pk', test2: 'test' }
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('puts 0 and false to required fields', () => {
    const { Item } = TestEntity5.build(PutItemCommand)
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

  test('correctly aliases pks', () => {
    const { Item } = TestEntity4.build(PutItemCommand).item({ id: 3, xyz: '123' }).params()
    expect(Item).toMatchObject({ pk: '3', sk: '3' })
  })

  // Options
  test('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestEntity.build(PutItemCommand)
      .item({ email: 'x', sort: 'y' })
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  test('fails on invalid capacity option', () => {
    const invalidCall = () =>
      TestEntity.build(PutItemCommand)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          capacity: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidCapacityOption' }))
  })

  test('sets metrics options', () => {
    const { ReturnItemCollectionMetrics } = TestEntity.build(PutItemCommand)
      .item({ email: 'x', sort: 'y' })
      .options({ metrics: 'SIZE' })
      .params()

    expect(ReturnItemCollectionMetrics).toBe('SIZE')
  })

  test('fails on invalid metrics option', () => {
    const invalidCall = () =>
      TestEntity.build(PutItemCommand)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          metrics: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidMetricsOption' }))
  })

  test('sets returnValues options', () => {
    const { ReturnValues } = TestEntity.build(PutItemCommand)
      .item({ email: 'x', sort: 'y' })
      .options({ returnValues: 'ALL_OLD' })
      .params()

    expect(ReturnValues).toBe('ALL_OLD')
  })

  test('fails on invalid returnValues option', () => {
    const invalidCall = () =>
      TestEntity.build(PutItemCommand)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          returnValues: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'options.invalidReturnValuesOption' })
    )
  })

  test('fails on extra options', () => {
    const invalidCall = () =>
      TestEntity.build(PutItemCommand)
        .item({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.unknownOption' }))
  })

  test('sets condition', () => {
    const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } =
      TestEntity.build(PutItemCommand)
        .item({ email: 'x', sort: 'y' })
        .options({ condition: { attr: 'email', gt: 'test' } })
        .params()

    expect(ExpressionAttributeNames).toEqual({ '#c_1': 'pk' })
    expect(ExpressionAttributeValues).toEqual({ ':c_1': 'test' })
    expect(ConditionExpression).toBe('#c_1 > :c_1')
  })

  test('missing item', () => {
    const invalidCall = () => TestEntity.build(PutItemCommand).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  test('transformed key/attribute', () => {
    const TestEntity3 = new Entity({
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

    const { Item, ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
      TestEntity3.build(PutItemCommand)
        .item({
          email: 'foo@bar.mail',
          sort: 'y',
          transformedStr: 'str',
          transformedSet: new Set(['set']),
          transformedList: ['list'],
          transformedMap: { str: 'map' },
          transformedRecord: { recordKey: 'recordValue' }
        })
        .options({
          condition: {
            and: [
              { attr: 'email', eq: 'test', transform: false },
              { attr: 'transformedStr', eq: 'str', transform: false },
              /**
               * @debt feature "Can you apply Contains clauses to Set attributes?"
               */
              // { attr: 'transformedSet', contains: 'SET' }
              { attr: 'transformedMap.str', eq: 'map', transform: false },
              { attr: 'transformedRecord.key', eq: 'value', transform: false }
            ]
          }
        })
        .params()

    expect(Item).toMatchObject({
      pk: 'EMAIL#foo@bar.mail',
      transformedStr: 'STR#str',
      transformedSet: new Set(['SET#set']),
      transformedList: ['LIST#list'],
      transformedMap: { str: 'MAP#map' },
      transformedRecord: { 'RECORD_KEY#recordKey': 'RECORD_VALUE#recordValue' }
    })
    expect(ConditionExpression).toContain('#c_5.#c_6 = :c_4')
    expect(ExpressionAttributeNames).toMatchObject({
      '#c_5': 'transformedRecord',
      // transform is only applied to values, not to paths
      '#c_6': 'RECORD_KEY#key'
    })
    expect(ExpressionAttributeValues).toMatchObject({
      ':c_1': 'test',
      ':c_2': 'str',
      ':c_3': 'map',
      ':c_4': 'value'
    })

    const { ExpressionAttributeValues: ExpressionAttributeValues2 } = TestEntity3.build(
      PutItemCommand
    )
      .item({
        email: 'foo@bar.mail',
        sort: 'y',
        transformedStr: 'str',
        transformedSet: new Set(['set']),
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

    expect(ExpressionAttributeValues2).toMatchObject({
      ':c_1': 'EMAIL#test',
      ':c_2': 'STR#str',
      ':c_3': 'MAP#map',
      ':c_4': 'RECORD_VALUE#value'
    })
  })
})
