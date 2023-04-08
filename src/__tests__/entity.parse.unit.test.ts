import { DocumentClient, DocumentClientWithWrappedNumbers } from './bootstrap.test'

import Table from '../classes/Table'
import Entity from '../classes/Entity'
import { toDynamoBigInt } from '../lib/utils'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient: DocumentClientWithWrappedNumbers
})

const TestEntity = new Entity({
  name: 'TestEntity',
  attributes: {
    email: { type: 'string', partitionKey: true },
    test_type: { type: 'string', sortKey: true },
    test_string: { type: 'string', coerce: false, default: 'test string' },
    test_string_coerce: { type: 'string' },
    test_number: { type: 'number', alias: 'count', coerce: false },
    test_number_coerce: { type: 'number', default: 0 },
    test_bigint: { type: 'bigint', coerce: false },
    test_bigint_coerce: { type: 'bigint' },
    test_boolean: { type: 'boolean', coerce: false },
    test_boolean_coerce: { type: 'boolean' },
    test_list: { type: 'list' },
    test_list_coerce: { type: 'list', coerce: true },
    test_map: { type: 'map', alias: 'contents' },
    test_string_set: { type: 'set' },
    test_number_set: { type: 'set' },
    test_binary_set: { type: 'set' },
    test_string_set_type: { type: 'set', setType: 'string' },
    test_number_set_type: { type: 'set', setType: 'number' },
    test_binary_set_type: { type: 'set', setType: 'binary' },
    test_bigint_set_type: { type: 'set', setType: 'bigint' },
    test_string_set_type_coerce: { type: 'set', setType: 'string', coerce: true },
    test_number_set_type_coerce: { type: 'set', setType: 'number', coerce: true },
    test_bigint_set_type_coerce: { type: 'set', setType: 'bigint', coerce: true },
    test_binary: { type: 'binary' },
    simple_string: 'string',
    format_simple_string: {
      type: 'string',
      format: (input: string) => input.toUpperCase()
    }
  },
  table: TestTable
})
const SimpleEntity = new Entity({
  name: 'SimpleEntity',
  attributes: {
    pk: { type: 'string', partitionKey: true },
    sk: { type: 'string', hidden: true, sortKey: true },
    test: { type: 'string' },
    test_composite: ['sk', 0, { save: true }],
    test_composite2: ['sk', 1, { save: false }],
    test_undefined: { default: () => undefined }
  },
  table: TestTable
})

const TestEntityHiddenType = new Entity({
  name: 'TestEntityHiddenType',
  attributes: {
    pk: { type: 'string', partitionKey: true },
    sk: { type: 'string', sortKey: true }
  },
  typeHidden: true,
  table: TestTable
})

const TestEntityHiddenTypeWithAlias = new Entity({
  name: 'TestEntityHiddenTypeWithAlias',
  attributes: {
    pk: { type: 'string', partitionKey: true },
    sk: { type: 'string', sortKey: true }
  },
  typeHidden: true,
  typeAlias: 'TestEntityHiddenTypeAlias',
  table: TestTable
})

describe('parse', () => {
  it('parses single item', () => {
    const item = TestEntity.parse({
      pk: 'test@test.com',
      sk: 'email',
      test_string: 'test',
      _et: 'TestEntity'
    })
    expect(item).toEqual({
      email: 'test@test.com',
      test_type: 'email',
      test_string: 'test',
      entity: 'TestEntity'
    })
  })

  it('parses single item and includes certain fields', () => {
    const item = TestEntity.parse(
      { pk: 'test@test.com', sk: 'email', test_string: 'test', _et: 'TestEntity' },
      ['email', 'sk']
    )
    expect(item).toEqual({
      email: 'test@test.com',
      test_type: 'email'
    })
  })

  it('parses single item and hide the entity type', () => {
    const item = TestEntityHiddenType.parse({
      pk: 'test@test.com',
      sk: 'email',
      _et: 'TestEntity'
    })

    expect(item).toEqual({
      pk: 'test@test.com',
      sk: 'email'
    })
  })

  it('parses single item with alias and hide the entity type', () => {
    const item = TestEntityHiddenTypeWithAlias.parse({
      pk: 'test@test.com',
      sk: 'email',
      _et: 'TestEntity'
    })

    expect(item).toEqual({
      pk: 'test@test.com',
      sk: 'email'
    })
  })

  it('parses multiple items', () => {
    const items = TestEntity.parse([
      { pk: 'test@test.com', sk: 'email', test_string: 'test' },
      { pk: 'test2@test.com', sk: 'email2', test_string: 'test2' }
    ])
    expect(items).toEqual([
      {
        email: 'test@test.com',
        test_type: 'email',
        test_string: 'test'
      },
      {
        email: 'test2@test.com',
        test_type: 'email2',
        test_string: 'test2'
      }
    ])
  })

  it('parses multiple items and incudes certain field', () => {
    const items = TestEntity.parse(
      [
        { pk: 'test@test.com', sk: 'email', test_string: 'test' },
        { pk: 'test2@test.com', sk: 'email2', test_string: 'test2' }
      ],
      ['pk', 'test_string']
    )
    expect(items).toEqual([
      {
        email: 'test@test.com',
        test_string: 'test'
      },
      {
        email: 'test2@test.com',
        test_string: 'test2'
      }
    ])
  })

  it('parses multiple items and hide the entity type', () => {
    const items = TestEntityHiddenType.parse([
      { pk: 'test@test.com', sk: 'email', _et: 'TestEntity' },
      { pk: 'test2@test.com', sk: 'email2', _et: 'TestEntity' }
    ])

    expect(items).toEqual([
      {
        pk: 'test@test.com',
        sk: 'email'
      },
      {
        pk: 'test2@test.com',
        sk: 'email2'
      }
    ])
  })

  it('parses composite field', () => {
    const item = SimpleEntity.parse({
      pk: 'test@test.com',
      sk: 'active#email',
      test_composite: 'test'
    })
    expect(item).toEqual({
      pk: 'test@test.com',
      test_composite: 'test',
      test_composite2: 'email'
    })
  })

  it('parses wrapped numbers', () => {
    const wrap = (value: number) =>
      unmarshall({ valueToUnmarshall: {N: value.toString()} }, { wrapNumbers: true }).valueToUnmarshall.value

    const item = TestEntity.parse({
      pk: 'test@test.com',
      sk: 'bigint',
      test_number: wrap(1234.567),
      test_number_coerce: wrap(-0.0023)
    })
    expect(item).toEqual({
      email: 'test@test.com',
      test_type: 'bigint',
      count: 1234.567,
      test_number_coerce: -0.0023
    })
  })

  it('parses bigints', () => {
    const item = TestEntity.parse({
      pk: 'test@test.com',
      sk: 'bigint',
      test_bigint: toDynamoBigInt(BigInt('90071992547409911234')),
      test_bigint_coerce: '12345'
    })
    expect(item).toEqual({
      email: 'test@test.com',
      test_type: 'bigint',
      test_bigint: BigInt('90071992547409911234'),
      test_bigint_coerce: BigInt('12345')
    })
  })

  it('parses bigint sets', () => {
    const item = TestEntity.parse({
      pk: 'test@test.com',
      sk: 'bigint',
      test_bigint_set_type: new Set([
        toDynamoBigInt(BigInt('90071992547409911234')),
        toDynamoBigInt(BigInt('-90071992547409911234')),
        1234
      ]),
    })
    expect(item).toEqual({
      email: 'test@test.com',
      test_type: 'bigint',
      test_bigint_set_type: [
        BigInt('90071992547409911234'),
        BigInt('-90071992547409911234'),
        BigInt(1234),
      ]
    })
  })
}) // end parse
