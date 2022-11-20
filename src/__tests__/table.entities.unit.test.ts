import { Table, Entity } from '../index'
import { DocumentClient } from './bootstrap.test'

let TestTable: any
let TestEntity: any
let TestEntity2: any

describe('entities', () => {
  beforeEach(() => {
    TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: {
        GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk' },
        GSI2: { partitionKey: 'GSI1pk' }
      },
      DocumentClient,
      attributes: {
        strongType: 'list'
      }
    })

    TestEntity = new Entity({
      name: 'TestEntity',
      autoExecute: false,
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        test: 'string'
      }
    } as const)
  })

  it('fails when assigning the same entity to the table', () => {
    TestTable.addEntity(TestEntity)
    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(`Entity name 'TestEntity' already exists on table 'test-table'`)
  })

  it('fails when assigning the same entity to the table', () => {
    TestEntity2 = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true }
      }
    } as const)

    TestTable.addEntity(TestEntity)
    expect(() => {
      TestTable.addEntity(TestEntity2)
    }).toThrow(`Entity name 'TestEntity' already exists`)
  })

  it('fails when using a reserved word as an entity name', () => {
    TestEntity = new Entity({
      name: 'query',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true }
      }
    } as const)

    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(`'query' is a reserved word and cannot be used to name an Entity`)
  })

  it('fails when missing a sort key', () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string' }
      }
    } as const)

    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(`TestEntity entity does not have a sortKey defined`)
  })

  it('fails when a sort key should not be defined', () => {
    TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk'
    })

    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true }
      }
    } as const)

    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(`TestEntity entity contains a sortKey, but the Table does not`)
  })

  it('fails when table key name conflicts with an attribute name', () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        pk: 'string'
      }
    } as const)

    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(`The Table's partitionKey name (pk) conflicts with an Entity attribute name`)
  })

  it('Maps a secondary index', () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI1pk: { partitionKey: 'GSI1' },
        GSI1sk: { sortKey: 'GSI1' }
      },
      table: TestTable
    } as const)

    expect(TestEntity.schema.keys).toHaveProperty('GSI1')
  })

  it('fails when mapping an invalid secondary index', () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI1pk: { partitionKey: 'GSI1x' }
      }
    } as const)

    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(`'GSI1x' is not a valid secondary index name`)
  })

  it('fails when mapping an invalid key for a secondary index', () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI2pk: { partitionKey: 'GSI2' },
        GSI2sk: { sortKey: 'GSI2' }
      }
    } as const)

    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(`TestEntity contains a sortKey, but it is not used by GSI2`)
  })

  it('fails when secondary index mapping conflicts with an entity attribute', () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI1pk: { partitionKey: 'GSI1' },
        GSI1skx: { sortKey: 'GSI1' },
        GSI1sk: 'string'
      }
    } as const)
    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(`GSI1's sortKey name (GSI1sk) conflicts with another Entity attribute name`)
  })

  it('fails when secondary index mapping is missing either the partition or sort key', () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI1pk: { partitionKey: 'GSI1' }
        // GSI1sk: {  },
      }
    } as const)
    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(`GSI1 requires mappings for both the partitionKey and the sortKey`)
  })

  it('fails when attribute conflicts with entityField', () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        _et: 'string'
      }
    } as const)
    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(
      `Attribute or alias '_et' conflicts with the table's 'entityField' mapping or entity alias`
    )
  })

  it(`fails when attribute type conflicts with table's type`, () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        strongType: 'number'
      }
    } as const)
    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(
      `TestEntity attribute type for 'strongType' (number) does not match table's type (list)`
    )
  })

  it(`adds setType to set types`, () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        testSet: { type: 'set', setType: 'number' }
      },
      table: TestTable
    } as const)

    TestEntity2 = new Entity({
      name: 'TestEntity2',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        testSet: { type: 'set', setType: 'string' }
      },
      table: TestTable
    } as const)
    expect(TestTable.Table.attributes.testSet.mappings.TestEntity._setType).toBe('number')
    expect(TestTable.Table.attributes.testSet.mappings.TestEntity2._setType).toBe('string')
  })

  it(`fails on invalid entity assignement`, () => {
    expect(() => {
      TestTable.addEntity({})
    }).toThrow(`Invalid Entity`)
  })
})
