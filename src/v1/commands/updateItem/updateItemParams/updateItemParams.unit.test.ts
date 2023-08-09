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
  ComputedDefault,
  DynamoDBToolboxError,
  UpdateItemCommand
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
    test_string: string().optional().updateDefault('default string'),
    test_string_coerce: string().optional(),
    count: number().optional().savedAs('test_number'),
    test_number_default: number().optional().updateDefault(0),
    test_boolean: boolean().optional(),
    test_boolean_coerce: boolean().optional(),
    test_boolean_default: boolean().optional().updateDefault(false),
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
    test_record: record(string(), number()).optional()
  }),
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
    sort: string().savedAs('sk').optional().default(ComputedDefault),
    test: string().optional(), // TODO: prefix with test---
    test_composite: string().optional(),
    test_composite2: string().optional(),
    test_undefined: any()
      .optional()
      // TODO: use unknown
      .default(() => '')
  }),
  computedDefaults: {
    sort: ({ test_composite, test_composite2 }) =>
      test_composite && test_composite2 && [test_composite, test_composite2].join('#')
  },
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
    // TODO: not sure what onUpdate could be reimplemented by
    // {
    //   type: 'number',
    //   map: 'test_mapped_number',
    //   default: 0,
    //   onUpdate: false
    // }
  }),
  timestamps: false,
  table: TestTable4
})

describe('update', () => {
  it('creates default update', () => {
    const { TableName, Key, UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({ email: 'test-pk', sort: 'test-sk' })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et)'
    )

    expect(Key).toStrictEqual({
      pk: 'test-pk',
      sk: 'test-sk'
    })

    expect(TableName).toBe('test-table')
  })

  it('creates update with multiple fields (default types)', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string: 'test string'
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = :test_string, #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et)'
    )
  })

  it('allows overriding default field values', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_boolean_default: true
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = :test_boolean_default, #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et)'
    )
  })

  it('overrides default field values that use mapping', () => {
    const { UpdateExpression } = TestEntity4.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        test_number_default_with_map: 111
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
    )
  })

  it('removes a field', () => {
    const { UpdateExpression } = TestEntity2.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        test: $remove()
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'REMOVE #test'
    )
  })

  it('removes a composite field', () => {
    const { UpdateExpression } = TestEntity2.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        test_composite: $remove()
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'REMOVE #test_composite'
    )
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

  it('fails when trying to remove the paritionKey', () => {
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
    const { UpdateExpression: UpdateExpressionA } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-pk',
        test_string_coerce: $get('test_string')
      })
      .params()

    expect(UpdateExpressionA).toBe(
      ''
      // TODO
      // 'REMOVE #test_composite'
    )

    const { UpdateExpression: UpdateExpressionB } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-pk',
        test_string_coerce: $get('test_string', 'foo')
      })
      .params()

    expect(UpdateExpressionB).toBe(
      ''
      // TODO
      // 'REMOVE #test_composite'
    )

    const { UpdateExpression: UpdateExpressionC } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-pk',
        test_string_coerce: $get('test_string', $get('simple_string'))
      })
      .params()

    expect(UpdateExpressionC).toBe(
      ''
      // TODO
      // 'REMOVE #test_composite'
    )

    const { UpdateExpression: UpdateExpressionD } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-pk',
        test_string_coerce: $get('test_string', $get('simple_string', 'bar'))
      })
      .params()

    expect(UpdateExpressionD).toBe(
      ''
      // TODO
      // 'REMOVE #test_composite'
    )
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

    /**
     * @debt TODO
     */
    expect(invalidCallA).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallA).not.toThrow(expect.objectContaining({ code: 'todo' }))

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

    /**
     * @debt TODO
     */
    expect(invalidCallD).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallD).not.toThrow(expect.objectContaining({ code: 'todo' }))

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
    const { UpdateExpression: UpdateExpressionA } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $sum(10, 10)
      })
      .params()

    expect(UpdateExpressionA).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) ADD #test_number :test_number, #test_number_set_type :test_number_set_type'
    )

    const { UpdateExpression: UpdateExpressionB } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $sum($get('count'), 10)
      })
      .params()

    expect(UpdateExpressionB).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) ADD #test_number :test_number, #test_number_set_type :test_number_set_type'
    )

    const { UpdateExpression: UpdateExpressionC } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $sum(10, $get('count', 10))
      })
      .params()

    expect(UpdateExpressionC).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) ADD #test_number :test_number, #test_number_set_type :test_number_set_type'
    )

    const { UpdateExpression: UpdateExpressionD } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $sum($get('count', 5), $get('count', 10))
      })
      .params()

    expect(UpdateExpressionD).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) ADD #test_number :test_number, #test_number_set_type :test_number_set_type'
    )
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

    /**
     * @debt TODO
     */
    expect(invalidCallC).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallC).not.toThrow(expect.objectContaining({ code: 'todo' }))

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
    const { UpdateExpression: UpdateExpressionA } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $subtract(10, 10)
      })
      .params()

    expect(UpdateExpressionA).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) ADD #test_number :test_number, #test_number_set_type :test_number_set_type'
    )

    const { UpdateExpression: UpdateExpressionB } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $subtract($get('count'), 10)
      })
      .params()

    expect(UpdateExpressionB).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) ADD #test_number :test_number, #test_number_set_type :test_number_set_type'
    )

    const { UpdateExpression: UpdateExpressionC } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $subtract(10, $get('count', 10))
      })
      .params()

    expect(UpdateExpressionC).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) ADD #test_number :test_number, #test_number_set_type :test_number_set_type'
    )

    const { UpdateExpression: UpdateExpressionD } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $subtract($get('count', 5), $get('count', 10))
      })
      .params()

    expect(UpdateExpressionD).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) ADD #test_number :test_number, #test_number_set_type :test_number_set_type'
    )
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

    /**
     * @debt TODO
     */
    expect(invalidCallC).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallC).not.toThrow(expect.objectContaining({ code: 'todo' }))

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
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_number_default: $add(10),
        test_number_set: $add(new Set([1, 2, 3]))
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) ADD #test_number :test_number, #test_number_set_type :test_number_set_type'
    )
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
    const { ExpressionAttributeNames } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string_set: new Set(['1', '2', '3']),
        test_number_set: new Set([1, 2, 3]),
        test_binary_set: new Set([Buffer.from('1'), Buffer.from('2'), Buffer.from('3')])
      })
      .params()

    expect(ExpressionAttributeNames).toMatchObject({
      // TODO
      // '#test_boolean_default': 'test_boolean_default'
    })
  })

  it('performs a delete operation on set', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_string_set: $delete(new Set(['1', '2', '3'])),
        test_number_set: $delete(new Set([1, 2, 3]))
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) DELETE #test_string_set_type :test_string_set_type, #test_number_set_type :test_number_set_type'
    )
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
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $set(['test1', 'test2'])
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_list[2] = :test_list_2, #test_list[5] = :test_list_5'
    )
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
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: { 2: 'Test2' },
        test_list_nested: { 1: { value: 'foo' } }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_list[2] = :test_list_2, #test_list[5] = :test_list_5'
    )
  })

  it('accepts references when udpating list element', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: { 2: $get('test_string') }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_list[2] = :test_list_2, #test_list[5] = :test_list_5'
    )
  })

  it('rejects invalid reference when udpating list element', () => {
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

    /**
     * @debt TODO
     */
    expect(invalidCallA).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallA).not.toThrow(expect.objectContaining({ code: 'todo' }))

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

    /**
     * @debt TODO
     */
    expect(invalidCallD).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallD).not.toThrow(expect.objectContaining({ code: 'todo' }))

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
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: {
          2: $remove()
        }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) REMOVE #test_list[2], #test_list[3], #test_list[8]'
    )
  })

  it('updates elements with a list', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: [undefined, $remove(), 'test']
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
    )
  })

  it('appends data to a list', () => {
    const { UpdateExpression: UpdateExpressionA } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $append(['1', '2', '3'])
      })
      .params()

    expect(UpdateExpressionA).toBe(
      ''
      // TODO
    )

    const { UpdateExpression: UpdateExpressionB } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $append([$get('test_string', '1'), '2', '3'])
      })
      .params()

    expect(UpdateExpressionB).toBe(
      ''
      // TODO
    )
  })

  it('accepts references while appending data to a list', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $append([$get('test_string'), '2', '3'])
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // `SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_list = list_append(if_not_exists(#test_list, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}) ,:test_list), #test_list_coerce = list_append(:test_list_coerce, if_not_exists(#test_list_coerce, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}))`
    )
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
          test_list_nested: $append([{ value: 'foo' }, $get('invalid_ref')])
        })
        .params()

    /**
     * @debt TODO
     */
    expect(invalidCallB).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallB).not.toThrow(
      expect.objectContaining({ code: 'parsing.invalidAttributeInput' })
    )

    const invalidCallC = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          /**
           * @debt type "Find a way to infer narrowly in $get"
           */
          // @ts-expect-error 'baz' not assignable to 'bar'
          test_list_nested: $append([{ value: 'foo' }, $get('email', { value: 'baz' as const })])
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('prepends data to a list', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $prepend(['a', 'b', 'c'])
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // `SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_list = list_append(if_not_exists(#test_list, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}) ,:test_list), #test_list_coerce = list_append(:test_list_coerce, if_not_exists(#test_list_coerce, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}))`
    )
  })

  it('accepts references while prepending data to a list', () => {
    const { UpdateExpression: UpdateExpressionA } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $prepend([$get('test_string'), '2', '3'])
      })
      .params()

    expect(UpdateExpressionA).toBe(
      ''
      // TODO
      // `SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_list = list_append(if_not_exists(#test_list, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}) ,:test_list), #test_list_coerce = list_append(:test_list_coerce, if_not_exists(#test_list_coerce, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}))`
    )

    const { UpdateExpression: UpdateExpressionB } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: $prepend([$get('test_string', '1'), '2', '3'])
      })
      .params()

    expect(UpdateExpressionB).toBe(
      ''
      // TODO
      // `SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_list = list_append(if_not_exists(#test_list, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}) ,:test_list), #test_list_coerce = list_append(:test_list_coerce, if_not_exists(#test_list_coerce, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}))`
    )
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
          test_list_nested: $prepend([{ value: 'foo' }, $get('invalid_ref')])
        })
        .params()

    /**
     * @debt TODO
     */
    expect(invalidCallB).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallB).not.toThrow(
      expect.objectContaining({ code: 'parsing.invalidAttributeInput' })
    )

    const invalidCallC = () =>
      TestEntity.build(UpdateItemCommand)
        .item({
          email: 'test-pk',
          sort: 'test-sk',
          /**
           * @debt type "Find a way to infer narrowly in $get"
           */
          // @ts-expect-error 'baz' not assignable to 'bar'
          test_list_nested: $prepend([{ value: 'foo' }, $get('email', { value: 'baz' as const })])
        })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('update, appends & prepends data to a list simulaneously', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_list: {
          // TODO: Create an $update helper just for this case
          // 1: 'a',
          ...$append(['a', 'b', 'c']),
          ...$prepend(['e', 'f', 'g'])
        }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // `SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_list = list_append(if_not_exists(#test_list, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}) ,:test_list), #test_list_coerce = list_append(:test_list_coerce, if_not_exists(#test_list_coerce, :${ATTRIBUTE_VALUES_LIST_DEFAULT_KEY}))`
    )
  })

  it('updates nested data in a map', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: { optional: 1 }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_map.#test_map_prop1 = :test_map_prop1, #test_map.#test_map_prop2[1] = :test_map_prop2_1, #test_map.#test_map_prop2[4] = :test_map_prop2_4, #test_map.#test_map_prop3.#test_map_prop3_prop4 = :test_map_prop3_prop4, #test_map.#test_map_prop5 = :test_map_prop5'
    )
  })

  it('removes nested data in a map', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: { optional: $remove() }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) REMOVE #test_map.#test_map_prop1, #test_map.#test_map_prop2'
    )
  })

  it('ignores undefined values', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: { optional: undefined }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) REMOVE #test_map.#test_map_prop1, #test_map.#test_map_prop2'
    )
  })

  it('accepts references', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: { optional: $get('test_number_default') }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_list[2] = :test_list_2, #test_list[5] = :test_list_5'
    )
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

    /**
     * @debt TODO
     */
    expect(invalidCallA).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallA).not.toThrow(expect.objectContaining({ code: 'todo' }))

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

    /**
     * @debt TODO
     */
    expect(invalidCallD).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallD).not.toThrow(expect.objectContaining({ code: 'todo' }))

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
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_map: $set({
          optional: 1
        })
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) REMOVE #test_map.#test_map_prop1, #test_map.#test_map_prop2'
    )
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
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: { foo: 1 }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_map.#test_map_prop1 = :test_map_prop1, #test_map.#test_map_prop2[1] = :test_map_prop2_1, #test_map.#test_map_prop2[4] = :test_map_prop2_4, #test_map.#test_map_prop3.#test_map_prop3_prop4 = :test_map_prop3_prop4, #test_map.#test_map_prop5 = :test_map_prop5'
    )
  })

  it('removes nested data in a record', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: { foo: $remove() }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) REMOVE #test_map.#test_map_prop1, #test_map.#test_map_prop2'
    )
  })

  it('ignores undefined values', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: { foo: undefined }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) REMOVE #test_map.#test_map_prop1, #test_map.#test_map_prop2'
    )
  })

  it('accepts references', () => {
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: { foo: $get('test_number_default') }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_list[2] = :test_list_2, #test_list[5] = :test_list_5'
    )
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

    /**
     * @debt TODO
     */
    expect(invalidCallA).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallA).not.toThrow(expect.objectContaining({ code: 'todo' }))

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

    /**
     * @debt TODO
     */
    expect(invalidCallD).not.toThrow(DynamoDBToolboxError)
    expect(invalidCallD).not.toThrow(expect.objectContaining({ code: 'todo' }))

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
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test-pk',
        sort: 'test-sk',
        test_record: $set({
          foo: 1
        })
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et) REMOVE #test_map.#test_map_prop1, #test_map.#test_map_prop2'
    )
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
    const { UpdateExpression } = TestEntity.build(UpdateItemCommand)
      .item({
        email: 'test@test.com',
        sort: 'test-sk',
        count: $add(10),
        contents: { test: 'test' }
      })
      .params()

    expect(UpdateExpression).toBe(
      ''
      // TODO
      // 'SET #test_string = if_not_exists(#test_string,:test_string), #test_number = if_not_exists(#test_number,:test_number), #test_boolean_default = if_not_exists(#test_boolean_default,:test_boolean_default), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test_map = :test_map ADD #test_number :test_number'
    )
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
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.invalidCapacityOption' }))
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
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.invalidMetricsOption' }))
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
      expect.objectContaining({ code: 'commands.invalidReturnValuesOption' })
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
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.unknownOption' }))
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

    expect(ConditionExpression).toBe('#c1 > :c1')
    expect(ExpressionAttributeNames).toMatchObject({ '#c1': 'pk' })
    expect(ExpressionAttributeValues).toMatchObject({ ':c1': 'test' })
  })

  it('missing item', () => {
    const invalidCall = () => TestEntity.build(UpdateItemCommand).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.incompleteCommand' }))
  })
})
