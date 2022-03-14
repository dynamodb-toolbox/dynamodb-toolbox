// Bootstrap testing
import { ddbDocClient as DocumentClient } from './bootstrap-tests'

// Require Table and Entity classes
import Table from '../classes/Table'
import Entity from '../classes/Entity'


describe('Table creation', ()=> {

  it('creates table w/ minimum options', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk'
    })

    expect(TestTable instanceof Table).toBe(true)
    expect(TestTable.name).toBe('test-table')
    expect(TestTable.Table.partitionKey).toBe('pk')
    expect(TestTable.Table.sortKey).toBeNull()
    expect(TestTable.Table.entityField).toBe('_et')
    expect(TestTable.Table.indexes).toEqual({})
    expect(TestTable.Table.attributes).toEqual({ _et: { type: 'string', mappings: {} } })
    expect(TestTable.autoExecute).toBe(true)
    expect(TestTable.autoParse).toBe(true)
    expect(TestTable.entities).toEqual([])
  }) // end table


  it('creates table w/ options', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      entityField: 'entity',
      autoExecute: false,
      autoParse: false
    })

    expect(TestTable instanceof Table).toBe(true)
    expect(TestTable.name).toBe('test-table')
    expect(TestTable.Table.partitionKey).toBe('pk')
    expect(TestTable.Table.sortKey).toBe('sk')
    expect(TestTable.Table.entityField).toBe('entity')
    expect(TestTable.Table.indexes).toEqual({})
    expect(TestTable.Table.attributes).toEqual({ entity: { type: 'string', mappings: {} } })
    expect(TestTable.autoExecute).toBe(false)
    expect(TestTable.autoParse).toBe(false)
    expect(TestTable.entities).toEqual([])
  }) // end table w/ options


  it('creates table w/ attributes', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      attributes: {
        stringAttr: 'string',
        numberAttr: 'number',
        binaryAttr: 'binary',
        booleanAttr: 'boolean',
        listAttr: 'list',
        mapAttr: 'map',
        stringSetAttr: 'set',
        numberSetAttr: { type: 'set', setType: 'number'},
        binarySetAttr: { type: 'set', setType: 'binary'}
      }
    })

    expect(TestTable instanceof Table).toBe(true)
    expect(TestTable.name).toBe('test-table')
    expect(TestTable.Table.partitionKey).toBe('pk')
    expect(TestTable.Table.sortKey).toBeNull()
    expect(TestTable.Table.entityField).toBe('_et')
    expect(TestTable.Table.indexes).toEqual({})
    expect(TestTable.autoExecute).toBe(true)
    expect(TestTable.autoParse).toBe(true)
    expect(TestTable.entities).toEqual([])

    // Check attribute parsing
    expect(TestTable.Table.attributes).toEqual({
      stringAttr: { type: 'string', mappings: {} },
      numberAttr: { type: 'number', mappings: {} },
      binaryAttr: { type: 'binary', mappings: {} },
      booleanAttr: { type: 'boolean', mappings: {} },
      listAttr: { type: 'list', mappings: {} },
      mapAttr: { type: 'map', mappings: {} },
      stringSetAttr: { type: 'set', mappings: {} },
      numberSetAttr: { type: 'set', setType: 'number', mappings: {} },
      binarySetAttr: { type: 'set', setType: 'binary', mappings: {} },
      _et: { type: 'string', mappings: {} }
    })
  }) // end table w/ attributes


  it('creates table w/ indexes', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      indexes: {
        // GSI w/ pk and sk
        GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk' },
        // GSI w/ only pk
        GSI2: { partitionKey: 'GSI2pk' },
        // LSI w/ reused pk
        LSI1: { partitionKey: 'pk', sortKey: 'LSI1sk' },
        // LSI w/ only sk
        LSI2: { sortKey: 'LSI2sk' }
      }
    })    

    expect(TestTable instanceof Table).toBe(true)
    expect(TestTable.name).toBe('test-table')
    expect(TestTable.Table.partitionKey).toBe('pk')
    expect(TestTable.Table.sortKey).toBeNull()
    expect(TestTable.Table.entityField).toBe('_et')
    expect(TestTable.Table.attributes).toEqual({ _et: { type: 'string', mappings: {} } })
    expect(TestTable.autoExecute).toBe(true)
    expect(TestTable.autoParse).toBe(true)
    expect(TestTable.entities).toEqual([])

    // Verify index parsing
    expect(TestTable.Table.indexes).toEqual({
      GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk', type: 'GSI' },
      GSI2: { partitionKey: 'GSI2pk', type: 'GSI' },
      LSI1: { sortKey: 'LSI1sk', type: 'LSI' },
      LSI2: { sortKey: 'LSI2sk', type: 'LSI' }
    })
  }) // end table w/ indexes


  it('creates table w/ DocumentClient', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      DocumentClient
    })

    expect(TestTable instanceof Table).toBe(true)
    expect(TestTable.DocumentClient!.constructor.name).toBe('DynamoDBDocumentClient')
    expect(TestTable.name).toBe('test-table')
    expect(TestTable.Table.partitionKey).toBe('pk')
    expect(TestTable.Table.sortKey).toBeNull()
    expect(TestTable.Table.entityField).toBe('_et')
    expect(TestTable.Table.indexes).toEqual({})
    expect(TestTable.Table.attributes).toEqual({ _et: { type: 'string', mappings: {} } })
    expect(TestTable.autoExecute).toBe(true)
    expect(TestTable.autoParse).toBe(true)
    expect(TestTable.entities).toEqual([])
  }) // end create table w/ DocumentClient


  it('creates table, then add DocumentClient', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk'
    })

    // Add the DocumentClient
    TestTable.DocumentClient = DocumentClient

    expect(TestTable instanceof Table).toBe(true)
    expect(TestTable.DocumentClient.constructor.name).toBe('DynamoDBDocumentClient')
    expect(TestTable.name).toBe('test-table')
    expect(TestTable.Table.partitionKey).toBe('pk')
    expect(TestTable.Table.sortKey).toBeNull()
    expect(TestTable.Table.entityField).toBe('_et')
    expect(TestTable.Table.indexes).toEqual({})
    expect(TestTable.Table.attributes).toEqual({ _et: { type: 'string', mappings: {} } })
    expect(TestTable.autoExecute).toBe(true)
    expect(TestTable.autoParse).toBe(true)
    expect(TestTable.entities).toEqual([])
  }) // end create table w/ DocumentClient


})