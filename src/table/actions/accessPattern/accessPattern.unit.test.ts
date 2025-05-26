import type { A } from 'ts-toolbelt'

import { $entities, Entity, QueryCommand, Table, item, map, number, string } from '~/index.js'
import { $options, $query } from '~/table/actions/query/constants.js'
import type { Query } from '~/table/actions/query/index.js'

import { AccessPattern } from './accessPattern.js'
import type { IAccessPattern } from './accessPattern.js'
import { $meta } from './constants.js'

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

const Entity1 = new Entity({
  name: 'entity1',
  schema: item({
    userPoolId: string().key().savedAs('pk'),
    userId: string().key().savedAs('sk'),
    name: string(),
    age: number()
  }),
  table: TestTable
})

const Entity2 = new Entity({
  name: 'entity2',
  schema: item({
    productGroupId: string().key().savedAs('pk'),
    productId: string().key().savedAs('sk'),
    launchDate: string(),
    price: number()
  }),
  table: TestTable
})

describe('accessPattern', () => {
  test('builds simple query', () => {
    const pk = TestTable.build(AccessPattern)
      .entities(Entity1, Entity2)
      .schema(string())
      .pattern(partition => ({ partition }))

    const assertExtends: A.Extends<typeof pk, IAccessPattern> = 1
    assertExtends

    const command = pk.query('123')

    const assert: A.Equals<
      typeof command,
      QueryCommand<typeof TestTable, [typeof Entity1, typeof Entity2]>
    > = 1
    assert

    expect(command).toBeInstanceOf(QueryCommand)
    expect(command.table).toStrictEqual(TestTable)
    expect(command[$entities]).toStrictEqual([Entity1, Entity2])
    expect(command[$query]).toStrictEqual({ partition: '123' })
  })

  test('builds secondary index query', () => {
    const lsi = TestTable.build(AccessPattern)
      .entities(Entity1, Entity2)
      .schema(string())
      .pattern(partition => ({ index: 'lsi', partition }))

    const command = lsi.query('123')

    expect(command).toBeInstanceOf(QueryCommand)
    expect(command[$query]).toStrictEqual({ index: 'lsi', partition: '123' })
  })

  test('builds query w. options', () => {
    const pk = TestTable.build(AccessPattern)
      .entities(Entity1, Entity2)
      .schema(string())
      .pattern(partition => ({ partition }))
      .options({ attributes: ['age', 'price'] })

    const command = pk.query('123')

    const assert: A.Equals<
      typeof command,
      QueryCommand<
        typeof TestTable,
        [typeof Entity1, typeof Entity2],
        Query<typeof TestTable>,
        { attributes: ('age' | 'price')[] }
      >
    > = 1
    assert

    expect(command).toBeInstanceOf(QueryCommand)
    expect(command[$options]).toStrictEqual({ attributes: ['age', 'price'] })
  })

  test('builds more complex query', () => {
    const eq = TestTable.build(AccessPattern)
      .schema(map({ partition: string(), eq: string() }))
      .pattern(({ partition, eq }) => ({ partition, range: { eq } }))

    const command = eq.query({ partition: 'p', eq: 'e' })

    expect(command[$query]).toStrictEqual({ partition: 'p', range: { eq: 'e' } })
  })

  test('describes access pattern', () => {
    const meta = {
      title: 'Get entities by partition',
      description: 'Sort key is OP!'
    }

    const ap = TestTable.build(AccessPattern).meta(meta)

    expect(ap[$meta]).toStrictEqual(meta)
  })
})
