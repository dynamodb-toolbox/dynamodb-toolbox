import {
  DynamoDBToolboxError,
  Entity,
  PutTransaction,
  Table,
  any,
  binary,
  boolean,
  list,
  map,
  number,
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

describe('put transaction', () => {
  test('creates basic item', () => {
    const {
      ToolboxItem,
      Put: { Item }
    } = TestEntity.build(PutTransaction).item({ email: 'test-pk', sort: 'test-sk' }).params()

    expect(Item).toStrictEqual({
      _et: TestEntity.name,
      _ct: expect.any(String),
      _md: expect.any(String),
      pk: 'test-pk',
      sk: 'test-sk',
      test_string: 'test string',
      test_number_defaulted: 0
    })

    expect(ToolboxItem).toMatchObject({
      entity: TestEntity.name,
      created: expect.any(String),
      modified: expect.any(String),
      email: 'test-pk',
      sort: 'test-sk',
      test_string: 'test string',
      test_number_defaulted: 0
    })
  })

  test('creates item with aliases', () => {
    const {
      Put: { Item }
    } = TestEntity.build(PutTransaction)
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

    const {
      Put: { Item }
    } = TestEntity.build(PutTransaction)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string: overrideValue
      })
      .params()

    expect(Item).toMatchObject({ test_string: overrideValue })
  })

  test('creates item with composite field', () => {
    const {
      Put: { Item }
    } = TestEntity2.build(PutTransaction)
      .item({
        email: 'test-pk',
        test_composite: 'test'
      })
      .params()

    expect(Item).not.toHaveProperty('sort')
  })

  test('creates item with filled composite key', () => {
    const {
      Put: { Item }
    } = TestEntity2.build(PutTransaction)
      .item({
        email: 'test-pk',
        test_composite: 'test',
        test_composite2: 'test2'
      })
      .params()

    expect(Item).toMatchObject({ sk: 'test#test2' })
  })

  test('creates item with overriden composite key', () => {
    const {
      Put: { Item }
    } = TestEntity2.build(PutTransaction)
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
      TestEntity3.build(PutTransaction)
        .item(
          // @ts-expect-error
          { email: 'test-pk' }
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('ignores additional attribute', () => {
    const {
      Put: { Item }
    } = TestEntity.build(PutTransaction)
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
      TestEntity.build(PutTransaction)
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
      TestEntity.build(PutTransaction)
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
      TestEntity.build(PutTransaction)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          count: 'x'
        })
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('with valid array', () => {
    const {
      Put: { Item }
    } = TestEntity.build(PutTransaction)
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
      TestEntity.build(PutTransaction)
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
    const {
      Put: { Item }
    } = TestEntity.build(PutTransaction)
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
      TestEntity.build(PutTransaction)
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
    const {
      Put: { Item }
    } = TestEntity.build(PutTransaction)
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
      TestEntity.build(PutTransaction)
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
      TestEntity3.build(PutTransaction)
        .item(
          // @ts-expect-error
          { email: 'test-pk', test2: 'test' }
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('puts 0 and false to required fields', () => {
    const {
      Put: { Item }
    } = TestEntity5.build(PutTransaction)
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
    const {
      Put: { Item }
    } = TestEntity4.build(PutTransaction).item({ id: 3, xyz: '123' }).params()
    expect(Item).toMatchObject({ pk: '3', sk: '3' })
  })

  // Options
  test('overrides tableName', () => {
    const {
      Put: { TableName }
    } = TestEntity.build(PutTransaction)
      .item({ email: 'x', sort: 'y' })
      .options({ tableName: 'tableName' })
      .params()

    expect(TableName).toBe('tableName')
  })

  test('fails on invalid tableName option', () => {
    const invalidCall = () =>
      TestEntity.build(PutTransaction)
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
      TestEntity.build(PutTransaction)
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
    const {
      Put: { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression }
    } = TestEntity.build(PutTransaction)
      .item({ email: 'x', sort: 'y' })
      .options({ condition: { attr: 'email', gt: 'test' } })
      .params()

    expect(ExpressionAttributeNames).toEqual({ '#c_1': 'pk' })
    expect(ExpressionAttributeValues).toEqual({ ':c_1': 'test' })
    expect(ConditionExpression).toBe('#c_1 > :c_1')
  })

  test('missing item', () => {
    const invalidCall = () => TestEntity.build(PutTransaction).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })
})
