import type { ITableDTO } from '~/table/actions/dto/index.js'
import { Table } from '~/table/index.js'

import { fromTableDTO } from './fromTableDTO.js'

describe('fromDTO - table', () => {
  test('creates correct table (full)', () => {
    const tableDTO: ITableDTO = {
      tableName: 'pokemons',
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'number' },
      entityAttributeSavedAs: '__entity__'
    }

    const table = fromTableDTO(tableDTO)

    expect(table).toBeInstanceOf(Table)
    expect(table.name).toBe('pokemons')

    expect(table.partitionKey).toStrictEqual({ name: 'pk', type: 'string' })
    expect(table.sortKey).toStrictEqual({ name: 'sk', type: 'number' })

    expect(table.entityAttributeSavedAs).toBe('__entity__')
  })

  test('creates correct table (light)', () => {
    const tableDTO: ITableDTO = {
      partitionKey: { name: 'pk', type: 'string' },
      entityAttributeSavedAs: '__entity__'
    }

    const table = fromTableDTO(tableDTO)

    expect(table).toBeInstanceOf(Table)
    expect(table.name).toBeUndefined()

    expect(table.partitionKey).toStrictEqual({ name: 'pk', type: 'string' })
    expect(table.sortKey).toBeUndefined()

    expect(table.entityAttributeSavedAs).toBe('__entity__')
  })
})
