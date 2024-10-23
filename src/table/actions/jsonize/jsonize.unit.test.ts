import type { A } from 'ts-toolbelt'

import { Table } from '~/table/table.js'

import { TableJSONizer } from './jsonize.js'
import type { JSONizedTable } from './schema.js'

describe('jsonize', () => {
  test('correctly jsonizes table (full)', () => {
    const table = new Table({
      name: 'super-table',
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'string' },
      entityAttributeSavedAs: '__entity__'
    })

    const json = table.build(TableJSONizer).jsonize()

    const assertJSON: A.Equals<typeof json, JSONizedTable> = 1
    assertJSON

    expect(json).toStrictEqual({
      type: 'table',
      name: 'super-table',
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'string' },
      entityAttributeSavedAs: '__entity__'
    })
  })

  test('correctly jsonizes table (empty)', () => {
    const table = new Table({
      partitionKey: { name: 'pk', type: 'string' }
    })

    const json = table.build(TableJSONizer).jsonize()

    const assertJSON: A.Equals<typeof json, JSONizedTable> = 1
    assertJSON

    expect(json).toStrictEqual({
      type: 'table',
      partitionKey: { name: 'pk', type: 'string' },
      entityAttributeSavedAs: '_et'
    })
  })
})
