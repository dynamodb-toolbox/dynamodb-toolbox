import type { A } from 'ts-toolbelt'

import { $entities, Entity, QueryCommand, Table, item, map, number, string } from '~/index.js'
import type { Query } from '~/index.js'
import { $options, $query } from '~/table/actions/query/constants.js'

import { AccessPattern } from './accessPattern.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  indexes: {
    lsi: {
      type: 'local',
      sortKey: { name: 'lsiSK', type: 'number' }
    }
  }
})

const TestEntity = new Entity({
  name: 'test-entity',
  schema: item({
    userPoolId: string().key().savedAs('pk'),
    userId: string().key().savedAs('sk'),
    name: string(),
    age: number(),
    common: string().optional()
  }),
  table: TestTable
})

describe('accessPattern', () => {
  test('builds simple query', () => {
    const pk = TestEntity.build(AccessPattern)
      .schema(string())
      .pattern(partition => ({ partition }))

    const command = pk.query('123')

    const assert: A.Equals<typeof command, QueryCommand<typeof TestTable, [typeof TestEntity]>> = 1
    assert

    expect(command).toBeInstanceOf(QueryCommand)
    expect(command.table).toStrictEqual(TestTable)
    expect(command[$entities]).toStrictEqual([TestEntity])
    expect(command[$query]).toStrictEqual({ partition: '123' })
  })

  test('builds secondary index query', () => {
    const lsi = TestEntity.build(AccessPattern)
      .schema(string())
      .pattern(partition => ({ index: 'lsi', partition }))

    const command = lsi.query('123')

    expect(command).toBeInstanceOf(QueryCommand)
    expect(command[$query]).toStrictEqual({ index: 'lsi', partition: '123' })
  })

  test('builds query w. options', () => {
    const pk = TestEntity.build(AccessPattern)
      .schema(string())
      .pattern(partition => ({ partition }))
      .options({ attributes: ['age'] })

    const command = pk.query('123')

    const assert: A.Equals<
      typeof command,
      QueryCommand<
        typeof TestTable,
        [typeof TestEntity],
        Query<typeof TestTable>,
        { attributes: 'age'[] }
      >
    > = 1
    assert

    expect(command).toBeInstanceOf(QueryCommand)
    expect(command[$options]).toStrictEqual({ attributes: ['age'] })
  })

  test('builds more complex query', () => {
    const eq = TestEntity.build(AccessPattern)
      .schema(map({ partition: string(), eq: string() }))
      .pattern(({ partition, eq }) => ({ partition, range: { eq } }))

    const command = eq.query({ partition: 'p', eq: 'e' })

    expect(command[$query]).toStrictEqual({ partition: 'p', range: { eq: 'e' } })
  })
})
