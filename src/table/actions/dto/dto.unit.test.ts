import type { A } from 'ts-toolbelt'

import { Table } from '~/table/table.js'

import { TableDTO } from './dto.js'
import type { ITableDTO } from './dto.js'

describe('DTO', () => {
  test('correctly builds table DTO (full)', () => {
    const table = new Table({
      name: 'super-table',
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'string' },
      entityAttributeSavedAs: '__entity__'
    })

    const dto = table.build(TableDTO)

    const assertJSON: A.Contains<typeof dto, ITableDTO> = 1
    assertJSON

    const tableObj = JSON.parse(JSON.stringify(dto))
    expect(tableObj).toStrictEqual({
      tableName: 'super-table',
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'string' },
      entityAttributeSavedAs: '__entity__'
    })
  })

  test('correctly builds table DTO (empty)', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' }
    })

    const dto = table.build(TableDTO)

    const assertJSON: A.Contains<typeof dto, ITableDTO> = 1
    assertJSON

    const tableObj = JSON.parse(JSON.stringify(dto))
    expect(tableObj).toStrictEqual({
      partitionKey: { name: 'pk', type: 'string' },
      entityAttributeSavedAs: '_et'
    })
  })
})
