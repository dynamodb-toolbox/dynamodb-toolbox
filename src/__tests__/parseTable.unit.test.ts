import parseTable from '../lib/parseTable.js'

// Require Table and Entity classes
import { TableConstructor } from '../classes/Table/types.js'

const table: TableConstructor<'test-table', 'pk', 'sk'> = {
  name: 'test-table',
  alias: 'test-table-alias',
  partitionKey: 'pk',
  sortKey: 'sk',
  entityField: 'entity',
  attributes: { pk: 'string', sk: 'string' },
  indexes: { GSI: { partitionKey: 'GSIpk', sortKey: 'GSIsk' } },
  autoExecute: false,
  autoParse: false
}

describe('parseTable', () => {
  test('parses simple mapping', async () => {
    const tbl = parseTable(table)
    expect(tbl.name).toBe('test-table')
    expect(tbl.alias).toBe('test-table-alias')
    expect(tbl.Table.attributes.entity).toEqual({ type: 'string', mappings: {} })
    expect(tbl.Table.attributes.pk).toEqual({ type: 'string', mappings: {} })
    expect(tbl.Table.attributes.sk).toEqual({ type: 'string', mappings: {} })
    expect(tbl.Table.entityField).toBe('entity')
    expect(tbl._entities).toEqual([])
    expect(tbl.autoExecute).toBe(false)
    expect(tbl.autoParse).toBe(false)
  })

  test('fails on extra config option', async () => {
    expect(() => {
      parseTable(Object.assign({}, table, { invalidConfig: true }))
    }).toThrow(`Invalid Table configuration options: invalidConfig`)
  })

  test('fails if missing name', async () => {
    expect(() => {
      parseTable(Object.assign({}, table, { name: undefined }))
    }).toThrow(`'name' must be defined`)
  })

  test('fails if alias is not a string', async () => {
    expect(() => {
      parseTable(Object.assign({}, table, { alias: 123 }))
    }).toThrow(`'alias' must be a string value`)
  })

  test('fails if missing partitionKey', async () => {
    expect(() => {
      parseTable(Object.assign({}, table, { partitionKey: undefined }))
    }).toThrow(`'partitionKey' must be defined`)
  })

  test('fails if sortKey is not a strin', async () => {
    expect(() => {
      parseTable(Object.assign({}, table, { sortKey: 123 }))
    }).toThrow(`'sortKey' must be a string value`)
  })

  test('fails if attributes is not an object', async () => {
    expect(() => {
      parseTable(Object.assign({}, table, { attributes: 'string' }))
    }).toThrow(`Please provide a valid 'attributes' object`)
  })

  test('passes if attributes is null', async () => {
    expect(parseTable(Object.assign({}, table, { attributes: null }))).toHaveProperty('Table')
  })

  test('passes if attributes is undefined', async () => {
    expect(parseTable(Object.assign({}, table, { attributes: undefined }))).toHaveProperty('Table')
  })

  test('fails if indexes is not an object', async () => {
    expect(() => {
      parseTable(Object.assign({}, table, { indexes: 'string' }))
    }).toThrow(`Please provide a valid 'indexes' object`)
  })

  test('fails if index contain extra arguments', async () => {
    expect(() => {
      parseTable(
        Object.assign({}, table, { indexes: { GSI: { partitionKey: 'pk', invalidParam: true } } })
      )
    }).toThrow(`Invalid index options: invalidParam`)
  })

  test('fails if index partitionKey is not a string', async () => {
    expect(() => {
      parseTable(Object.assign({}, table, { indexes: { GSI: { partitionKey: 123 } } }))
    }).toThrow(`'partitionKey' for GSI must be a string`)
  })

  test('fails if index sortKey is not a string', async () => {
    expect(() => {
      parseTable(Object.assign({}, table, { indexes: { GSI: { sortKey: 123 } } }))
    }).toThrow(`'sortKey' for GSI must be a string`)
  })

  test('fails if index does not contain partitionKey or sortKey', async () => {
    expect(() => {
      parseTable(Object.assign({}, table, { indexes: { GSI: {} } }))
    }).toThrow(`A 'partitionKey', 'sortKey' or both, must be provided for GSI`)
  })
})
