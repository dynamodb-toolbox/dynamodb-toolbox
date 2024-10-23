import { Table } from '~/table/index.js'

import type { JSONizedTable } from '../jsonize/schema.js'
import { fromJSON } from './table.js'

describe('fromJSON - table', () => {
  test('creates correct table (full)', () => {
    const jsonizedTable: JSONizedTable = {
      type: 'table',
      name: 'pokemons',
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'number' },
      entityAttributeSavedAs: '__entity__'
    }

    const importedTable = fromJSON(jsonizedTable)

    expect(importedTable).toBeInstanceOf(Table)
    expect(importedTable.name).toBe('pokemons')

    expect(importedTable.partitionKey).toStrictEqual({ name: 'pk', type: 'string' })
    expect(importedTable.sortKey).toStrictEqual({ name: 'sk', type: 'number' })

    expect(importedTable.entityAttributeSavedAs).toBe('__entity__')
  })

  test('creates correct table (light)', () => {
    const jsonizedTable: JSONizedTable = {
      type: 'table',
      partitionKey: { name: 'pk', type: 'string' },
      entityAttributeSavedAs: '__entity__'
    }

    const importedTable = fromJSON(jsonizedTable)

    expect(importedTable).toBeInstanceOf(Table)
    expect(importedTable.name).toBeUndefined()

    expect(importedTable.partitionKey).toStrictEqual({ name: 'pk', type: 'string' })
    expect(importedTable.sortKey).toBeUndefined()

    expect(importedTable.entityAttributeSavedAs).toBe('__entity__')
  })
})
