import { Table } from '~/table/table.js'

import { CDKTableV2 } from './cdk.js'

describe('CDKTableV2', () => {
  test('maps keys & indexes', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'number' },
      indexes: {
        byType: {
          type: 'global',
          partitionKey: { name: 'type', type: 'string' },
          sortKey: { name: 'createdAt', type: 'string' }
        },
        byLevel: { type: 'local', sortKey: { name: 'level', type: 'number' } }
      }
    })

    expect(table.build(CDKTableV2).props()).toStrictEqual({
      partitionKey: { name: 'pk', type: 'S' },
      sortKey: { name: 'sk', type: 'N' },
      globalSecondaryIndexes: [
        {
          indexName: 'byType',
          partitionKey: { name: 'type', type: 'S' },
          sortKey: { name: 'createdAt', type: 'S' }
        }
      ],
      localSecondaryIndexes: [{ indexName: 'byLevel', sortKey: { name: 'level', type: 'N' } }]
    })
  })

  test('maps binary keys', () => {
    const table = new Table({ partitionKey: { name: 'pk', type: 'binary' } })

    expect(table.build(CDKTableV2).props()).toStrictEqual({
      partitionKey: { name: 'pk', type: 'B' }
    })
  })

  test('only emits partitionKey if the Table has no sort key nor indexes', () => {
    const table = new Table({ partitionKey: { name: 'pk', type: 'string' } })

    expect(table.build(CDKTableV2).props()).toStrictEqual({
      partitionKey: { name: 'pk', type: 'S' }
    })
  })

  test('omits localSecondaryIndexes if the Table only has global indexes', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' },
      indexes: { gsi: { type: 'global', partitionKey: { name: 'gsipk', type: 'string' } } }
    })

    expect(table.build(CDKTableV2).props()).toStrictEqual({
      partitionKey: { name: 'pk', type: 'S' },
      globalSecondaryIndexes: [{ indexName: 'gsi', partitionKey: { name: 'gsipk', type: 'S' } }]
    })
  })

  test('omits globalSecondaryIndexes if the Table only has local indexes', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'string' },
      indexes: { lsi: { type: 'local', sortKey: { name: 'lsisk', type: 'number' } } }
    })

    expect(table.build(CDKTableV2).props()).toStrictEqual({
      partitionKey: { name: 'pk', type: 'S' },
      sortKey: { name: 'sk', type: 'S' },
      localSecondaryIndexes: [{ indexName: 'lsi', sortKey: { name: 'lsisk', type: 'N' } }]
    })
  })

  test('maps multi-attribute global index keys to plural props (order preserved)', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' },
      indexes: {
        gsi: {
          type: 'global',
          partitionKeys: [
            { name: 'a', type: 'string' },
            { name: 'b', type: 'number' }
          ],
          sortKeys: [
            { name: 'c', type: 'binary' },
            { name: 'd', type: 'string' }
          ]
        }
      }
    })

    expect(table.build(CDKTableV2).props()).toStrictEqual({
      partitionKey: { name: 'pk', type: 'S' },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKeys: [
            { name: 'a', type: 'S' },
            { name: 'b', type: 'N' }
          ],
          sortKeys: [
            { name: 'c', type: 'B' },
            { name: 'd', type: 'S' }
          ]
        }
      ]
    })
  })

  test('collapses 1-element global index key arrays to singular props', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' },
      indexes: {
        gsi: {
          type: 'global',
          partitionKeys: [{ name: 'a', type: 'string' }],
          sortKeys: [{ name: 'b', type: 'number' }]
        }
      }
    })

    expect(table.build(CDKTableV2).props()).toStrictEqual({
      partitionKey: { name: 'pk', type: 'S' },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKey: { name: 'a', type: 'S' },
          sortKey: { name: 'b', type: 'N' }
        }
      ]
    })
  })

  test('passes empty global index key arrays through', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' },
      indexes: {
        gsi: { type: 'global', partitionKey: { name: 'a', type: 'string' }, sortKeys: [] }
      }
    })

    expect(table.build(CDKTableV2).props()).toStrictEqual({
      partitionKey: { name: 'pk', type: 'S' },
      globalSecondaryIndexes: [
        { indexName: 'gsi', partitionKey: { name: 'a', type: 'S' }, sortKeys: [] }
      ]
    })
  })

  test('preserves index declaration order', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'string' },
      indexes: {
        gsi2: { type: 'global', partitionKey: { name: 'gsi2pk', type: 'string' } },
        lsi2: { type: 'local', sortKey: { name: 'lsi2sk', type: 'string' } },
        gsi1: { type: 'global', partitionKey: { name: 'gsi1pk', type: 'string' } },
        lsi1: { type: 'local', sortKey: { name: 'lsi1sk', type: 'string' } }
      }
    })

    const { globalSecondaryIndexes, localSecondaryIndexes } = table.build(CDKTableV2).props()

    expect(globalSecondaryIndexes?.map(({ indexName }) => indexName)).toStrictEqual([
      'gsi2',
      'gsi1'
    ])
    expect(localSecondaryIndexes?.map(({ indexName }) => indexName)).toStrictEqual(['lsi2', 'lsi1'])
  })

  describe('tableName', () => {
    test('emits static names by default', () => {
      const table = new Table({ name: 'poke-table', partitionKey: { name: 'pk', type: 'string' } })

      expect(table.build(CDKTableV2).props()).toStrictEqual({
        tableName: 'poke-table',
        partitionKey: { name: 'pk', type: 'S' }
      })
    })

    test('omits function names by default', () => {
      const table = new Table({ name: () => 'x', partitionKey: { name: 'pk', type: 'string' } })

      expect(table.build(CDKTableV2).props()).not.toHaveProperty('tableName')
    })

    test('omits missing names by default', () => {
      const table = new Table({ partitionKey: { name: 'pk', type: 'string' } })

      expect(table.build(CDKTableV2).props()).not.toHaveProperty('tableName')
    })

    test('resolves function names if tableName is true', () => {
      const table = new Table({ name: () => 'x', partitionKey: { name: 'pk', type: 'string' } })

      expect(table.build(CDKTableV2).props({ tableName: true })).toHaveProperty('tableName', 'x')
    })

    test('throws if tableName is true and the Table has no name', () => {
      const table = new Table({ partitionKey: { name: 'pk', type: 'string' } })

      const invalidCall = () => table.build(CDKTableV2).props({ tableName: true })

      expect(invalidCall).toThrow(expect.objectContaining({ code: 'table.missingTableName' }))
    })

    test('omits static names if tableName is false', () => {
      const table = new Table({ name: 'poke-table', partitionKey: { name: 'pk', type: 'string' } })

      expect(table.build(CDKTableV2).props({ tableName: false })).not.toHaveProperty('tableName')
    })
  })

  test('returns fresh objects and does not mutate the Table', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' },
      indexes: {
        gsi: {
          type: 'global',
          partitionKeys: [
            { name: 'a', type: 'string' },
            { name: 'b', type: 'string' }
          ]
        }
      }
    })
    const cdkTable = table.build(CDKTableV2)

    const firstProps = cdkTable.props()
    firstProps.globalSecondaryIndexes?.[0]?.partitionKeys?.splice(0)
    firstProps.globalSecondaryIndexes?.splice(0)

    expect(cdkTable.props()).toStrictEqual({
      partitionKey: { name: 'pk', type: 'S' },
      globalSecondaryIndexes: [
        {
          indexName: 'gsi',
          partitionKeys: [
            { name: 'a', type: 'S' },
            { name: 'b', type: 'S' }
          ]
        }
      ]
    })
    expect(table.indexes).toStrictEqual({
      gsi: {
        type: 'global',
        partitionKeys: [
          { name: 'a', type: 'string' },
          { name: 'b', type: 'string' }
        ]
      }
    })
  })

  test('passes invalid index definitions through (no validation)', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' },
      indexes: { lsi: { type: 'local', sortKey: { name: 'lsisk', type: 'string' } } }
    })

    expect(table.build(CDKTableV2).props()).toStrictEqual({
      partitionKey: { name: 'pk', type: 'S' },
      localSecondaryIndexes: [{ indexName: 'lsi', sortKey: { name: 'lsisk', type: 'S' } }]
    })
  })
})
