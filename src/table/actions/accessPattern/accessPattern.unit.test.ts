import type { A } from 'ts-toolbelt'

import { Entity, QueryCommand, Table, item, map, number, string } from '~/index.js'
import { $options, $query } from '~/table/actions/query/constants.js'
import { $entities } from '~/table/constants.js'

import type { IAccessPattern } from './accessPattern.js'
import { AccessPattern } from './accessPattern.js'
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
      QueryCommand<typeof TestTable, [typeof Entity1, typeof Entity2], { partition: string }>
    > = 1
    assert

    expect(command).toBeInstanceOf(QueryCommand)
    expect(command.table).toStrictEqual(TestTable)
    expect(command[$entities]).toStrictEqual([Entity1, Entity2])
    expect(command[$query]).toStrictEqual({ partition: '123' })
  })

  test('provides no input if no schema is provided', () => {
    const pk = TestTable.build(AccessPattern)
      .entities(Entity1, Entity2)
      .pattern(input => {
        // @ts-expect-error TODO
        const assert: A.Equals<typeof input, undefined> = 1
        assert

        expect(input).toBeUndefined()

        return { partition: '123' }
      })

    // @ts-expect-error TODO
    const command = pk.query()

    const assert: A.Equals<
      typeof command,
      QueryCommand<typeof TestTable, [typeof Entity1, typeof Entity2], { partition: string }>
    > = 1
    assert

    expect(command[$query]).toStrictEqual({ partition: '123' })
  })

  test('builds secondary index query', () => {
    const lsi = TestTable.build(AccessPattern)
      .entities(Entity1, Entity2)
      .schema(string())
      .pattern(partition => ({ index: 'lsi', partition }))

    const assertExtends: A.Extends<typeof lsi, IAccessPattern> = 1
    assertExtends

    const command = lsi.query('123')

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
        { partition: string },
        { attributes: ('age' | 'price')[] }
      >
    > = 1
    assert

    expect(command[$options]).toStrictEqual({ attributes: ['age', 'price'] })
  })

  test('builds query w. options callback', () => {
    const pk = TestTable.build(AccessPattern)
      .entities(Entity1, Entity2)
      .schema(string())
      .pattern(partition => ({ partition }))
      .options({ consistent: true })
      .options(prevOptions => {
        const assertOptions: A.Equals<typeof prevOptions, { consistent: true }> = 1
        assertOptions

        return { ...prevOptions, reverse: true }
      })

    const command = pk.query('123')

    const assert: A.Equals<
      typeof command,
      QueryCommand<
        typeof TestTable,
        [typeof Entity1, typeof Entity2],
        { partition: string },
        { consistent: true; reverse: true }
      >
    > = 1
    assert

    expect(command[$options]).toStrictEqual({ consistent: true, reverse: true })
  })

  test('builds query w. context options', () => {
    const pk = TestTable.build(AccessPattern)
      .entities(Entity1, Entity2)
      .schema(string())
      .pattern(partition => ({
        partition,
        options: partition === '123' ? { attributes: ['age', 'price'] } : {}
      }))
      .options({ reverse: true })

    const command = pk.query('123')

    const assert: A.Equals<
      typeof command,
      QueryCommand<
        typeof TestTable,
        [typeof Entity1, typeof Entity2],
        { partition: string },
        { reverse: true } & ({ attributes: ('age' | 'price')[] } | { attributes?: undefined })
      >
    > = 1
    assert

    expect(command[$options]).toStrictEqual({ reverse: true, attributes: ['age', 'price'] })

    const command2 = pk.query('321')
    expect(command2[$options]).toStrictEqual({ reverse: true })
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
