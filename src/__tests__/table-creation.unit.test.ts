import Table from '../classes/Table/Table.js'
import { DocumentClient, DocumentClientWithoutConfig } from './bootstrap.test.js'

describe('Table creation', () => {
  test('creates table w/ minimum options', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk'
    })

    expect(TestTable).toEqual(
      expect.objectContaining({
        name: 'test-table',
        Table: expect.objectContaining({
          partitionKey: 'pk',
          sortKey: null,
          entityField: '_et',
          indexes: {},
          attributes: { _et: { type: 'string', mappings: {} } }
        }),
        autoExecute: true,
        autoParse: true,
        entities: []
      })
    )
  })

  test('creates table w/ options', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      entityField: 'entity',
      autoExecute: false,
      autoParse: false
    })

    expect(TestTable).toEqual(
      expect.objectContaining({
        name: 'test-table',
        Table: expect.objectContaining({
          partitionKey: 'pk',
          sortKey: 'sk',
          entityField: 'entity',
          indexes: {},
          attributes: { entity: { type: 'string', mappings: {} } }
        }),
        autoExecute: false,
        autoParse: false,
        entities: []
      })
    )
  })

  test('creates table w/ attributes', async () => {
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
        numberSetAttr: { type: 'set', setType: 'number' },
        binarySetAttr: { type: 'set', setType: 'binary' }
      }
    })

    expect(TestTable).toEqual(
      expect.objectContaining({
        name: 'test-table',
        Table: expect.objectContaining({
          partitionKey: 'pk',
          sortKey: null,
          entityField: '_et',
          indexes: {},
          attributes: {
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
          }
        })
      })
    )
  })

  test('creates table w/ indexes', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      indexes: {
        GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk' },
        GSI2: { partitionKey: 'GSI2pk' },
        LSI1: { partitionKey: 'pk', sortKey: 'LSI1sk' },
        LSI2: { sortKey: 'LSI2sk' }
      }
    })

    expect(TestTable).toEqual(
      expect.objectContaining({
        name: 'test-table',
        Table: expect.objectContaining({
          partitionKey: 'pk',
          sortKey: null,
          entityField: '_et',
          indexes: {
            GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk', type: 'GSI' },
            GSI2: { partitionKey: 'GSI2pk', type: 'GSI' },
            LSI1: { sortKey: 'LSI1sk', type: 'LSI' },
            LSI2: { sortKey: 'LSI2sk', type: 'LSI' }
          },
          attributes: {
            _et: { type: 'string', mappings: {} }
          }
        }),
        autoExecute: true,
        autoParse: true,
        entities: []
      })
    )
  })

  test('creates table w/ DocumentClient', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      DocumentClient
    })

    expect(TestTable.DocumentClient.constructor.name).toBe('DynamoDBDocumentClient')
    expect(TestTable).toEqual(
      expect.objectContaining({
        name: 'test-table',
        Table: expect.objectContaining({
          partitionKey: 'pk',
          sortKey: null,
          entityField: '_et',
          indexes: {},
          attributes: { _et: { type: 'string', mappings: {} } }
        }),
        autoExecute: true,
        autoParse: true,
        entities: []
      })
    )
  })

  test('creates table, then add DocumentClient', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk'
    })

    TestTable.DocumentClient = DocumentClient

    expect(TestTable.DocumentClient.constructor.name).toBe('DynamoDBDocumentClient')
    expect(TestTable).toEqual(
      expect.objectContaining({
        name: 'test-table',
        Table: expect.objectContaining({
          partitionKey: 'pk',
          sortKey: null,
          entityField: '_et',
          indexes: {},
          attributes: { _et: { type: 'string', mappings: {} } }
        }),
        entities: [],
        autoExecute: true,
        autoParse: true
      })
    )
  })

  test('sets translateConfig with marshalOptions for DocumentClient if empty', async () => {
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      DocumentClient: DocumentClientWithoutConfig
    })

    expect(TestTable.DocumentClient.config.translateConfig).toEqual({
      marshallOptions: {
        convertEmptyValues: true
      }
    })
  })
})
