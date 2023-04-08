import { Table, Entity } from '../index'
import { DocumentClient } from './bootstrap.test'

let TestTable: any
let TestEntity: any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let TestEntity2: any

describe('entities', () => {
  beforeEach(() => {
    TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: {
        GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk' },
        GSI2: { partitionKey: 'GSI1pk' },
      },
      DocumentClient,
      attributes: {
        strongType: 'list',
      },
    })

    TestEntity = new Entity({
      name: 'TestEntity',
      autoExecute: false,
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        test: 'string',
      },
    } as const)
  })

  it('fails when using a reserved word as an entity name', () => {
    TestEntity = new Entity({
      name: 'query',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
      },
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
        sort: { type: 'string' },
      },
    } as const)

    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(`TestEntity entity does not have a sortKey defined`)
  })

  it('fails when a sort key should not be defined', () => {
    TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
    })

    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
      },
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
        pk: 'string',
      },
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
        GSI1sk: { sortKey: 'GSI1' },
      },
      table: TestTable,
    } as const)

    expect(TestEntity.schema.keys).toHaveProperty('GSI1')
  })

  it('fails when mapping an invalid secondary index', () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI1pk: { partitionKey: 'GSI1x' },
      },
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
        GSI2sk: { sortKey: 'GSI2' },
      },
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
        GSI1sk: 'string',
      },
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
        GSI1pk: { partitionKey: 'GSI1' },
        // GSI1sk: {  },
      },
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
        _et: 'string',
      },
    } as const)
    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(
      `Attribute or alias '_et' conflicts with the table's 'entityField' mapping or entity alias`,
    )
  })

  it(`fails when attribute type conflicts with table's type`, () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        strongType: 'number',
      },
    } as const)
    expect(() => {
      TestTable.addEntity(TestEntity)
    }).toThrow(
      `TestEntity attribute type for 'strongType' (number) does not match table's type (list)`,
    )
  })

  it(`adds setType to set types`, () => {
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        testSet: { type: 'set', setType: 'number' },
      },
      table: TestTable,
    } as const)

    TestEntity2 = new Entity({
      name: 'TestEntity2',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        testSet: { type: 'set', setType: 'string' },
      },
      table: TestTable,
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

describe('removeEntity', () => {
  beforeEach(() => {
    TestTable = new Table({
      name: 'TestTable',
      partitionKey: 'pk',
      sortKey: 'sk',
    } as const)

    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        test_pk: { type: 'string', partitionKey: true },
        test_sk: { type: 'string', sortKey: true },
      },
    })
  })

  it('removes the given entity from the table', () => {
    TestTable.addEntity(TestEntity)
    expect(TestTable.entities).toContain('TestEntity')

    TestTable.removeEntity(TestEntity)
    expect(TestTable.entities).not.toContain('TestEntity')
  })

  it('fails when removing an invalid entity', () => {
    expect(() => {
      TestTable.removeEntity({})
    }).toThrow('Entity must be an instance of Entity')
  })

  it('removes the property mappings from the table in case only the removed entity has them', () => {
    TestTable.addEntity(TestEntity)
    expect(TestTable.Table.attributes).toEqual(expect.objectContaining({
      pk: {
        mappings: {
          TestEntity: {
            test_pk: 'string',
          },
        },
        type: 'string',
      },
      sk: {
        mappings: {
          TestEntity: {
            'test_sk': 'string',
          },
        },
        type: 'string',
      },
    }))

    TestTable.removeEntity(TestEntity)
    expect(TestTable.Table.attributes).not.toHaveProperty('pk')
    expect(TestTable.Table.attributes).not.toHaveProperty('sk')
  })

  it('does not remove the property mappings from the table in case other entities have them', () => {
    TestTable.addEntity(TestEntity)

    const TestEntity2 = new Entity({
      name: 'TestEntity2',
      attributes: {
        test_pk: { type: 'string', partitionKey: true },
        test_sk: { type: 'string', sortKey: true },
      },
    })

    TestTable.addEntity(TestEntity2)
    expect(TestTable.Table.attributes).toEqual(expect.objectContaining({
      pk: {
        mappings: {
          TestEntity: {
            test_pk: 'string',
          },
          TestEntity2: {
            test_pk: 'string',
          },
        },
        type: 'string',
      },
      sk: {
        mappings: {
          TestEntity: {
            'test_sk': 'string',
          },
          TestEntity2: {
            'test_sk': 'string',
          },
        },
        type: 'string',
      },
    }))

    TestTable.removeEntity(TestEntity)
    expect(TestTable.Table.attributes).toEqual(expect.objectContaining({
      pk: {
        mappings: {
          TestEntity2: {
            test_pk: 'string',
          },
        },
        type: 'string',
      },
      sk: {
        mappings: {
          TestEntity2: {
            'test_sk': 'string',
          },
        },
        type: 'string',
      },
    }))
  })

  it('removes the property mappings from the table for an entity with indexes', () => {
    TestTable = new Table({
      name: 'TestTable',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: {
        testIndex: {
          partitionKey: 'test_table_gsi1_pk',
          sortKey: 'test_table_gsi1_sk',
        },
      },
    } as const)

    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        test_pk: { type: 'string', partitionKey: true },
        test_sk: { type: 'string', sortKey: true },
        test_entity_gsi1_pk: { type: 'string', partitionKey: 'testIndex' },
        test_entity_gsi1_sk: { type: 'string', sortKey: 'testIndex' },
      },
    } as const)

    TestTable.addEntity(TestEntity)

    expect(TestTable.Table.attributes).toEqual(expect.objectContaining({
      pk: {
        mappings: {
          TestEntity: {
            test_pk: 'string',
          },
        },
        type: 'string',
      },
      sk: {
        mappings: {
          TestEntity: {
            test_sk: 'string',
          },
        },
        type: 'string',
      },
      test_table_gsi1_pk: {
        mappings: {
          TestEntity: {
            test_entity_gsi1_pk: 'string',
          },
        },
        type: 'string',
      },
      test_table_gsi1_sk: {
        mappings: {
          TestEntity: {
            test_entity_gsi1_sk: 'string',
          },
        },
        type: 'string',
      },
    }))

    TestTable.removeEntity(TestEntity)

    expect(TestTable.Table.attributes).not.toHaveProperty('pk')
    expect(TestTable.Table.attributes).not.toHaveProperty('sk')
    expect(TestTable.Table.attributes).not.toHaveProperty('testGsi1_pk')
    expect(TestTable.Table.attributes).not.toHaveProperty('testGsi1_sk')
  })

  it('removes the property index mappings from the table for an entity with indexes', () => {
    TestTable = new Table({
      name: 'TestTable',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: {
        testIndex: {
          partitionKey: 'test_table_gsi1_pk',
          sortKey: 'test_table_gsi1_sk',
        },
      },
    } as const)

    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        test_pk: { type: 'string', partitionKey: true },
        test_sk: { type: 'string', sortKey: true },
        test_entity_gsi1_pk: { type: 'string', partitionKey: 'testIndex' },
        test_entity_gsi1_sk: { type: 'string', sortKey: 'testIndex' },
      },
    } as const)

    TestTable.addEntity(TestEntity)

    expect(TestTable.Table.indexes).toEqual(expect.objectContaining({
      testIndex: {
        partitionKey: 'test_table_gsi1_pk',
        sortKey: 'test_table_gsi1_sk',
        type: 'GSI',
      },
    }))

    TestTable.removeEntity(TestEntity)

    expect(TestTable.Table.indexes).toHaveProperty('testIndex')
  })

  it('does not remove the property index mappings from the table in case other entities have them', () => {
    TestTable = new Table({
      name: 'TestTable',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: {
        testIndex: {
          partitionKey: 'test_table_gsi1_pk',
          sortKey: 'test_table_gsi1_sk',
        },
      },
    } as const)

    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        test_pk: { type: 'string', partitionKey: true },
        test_sk: { type: 'string', sortKey: true },
        test_entity_gsi1_pk: { type: 'string', partitionKey: 'testIndex' },
        test_entity_gsi1_sk: { type: 'string', sortKey: 'testIndex' },
      },
    } as const)

    TestTable.addEntity(TestEntity)

    const TestEntity2 = new Entity({
      name: 'TestEntity2',
      attributes: {
        test_pk: { type: 'string', partitionKey: true },
        test_sk: { type: 'string', sortKey: true },
        test_entity_gsi1_pk: { type: 'string', partitionKey: 'testIndex' },
        test_entity_gsi1_sk: { type: 'string', sortKey: 'testIndex' },
      },
    } as const)

    TestTable.addEntity(TestEntity2)

    expect(TestTable.Table.indexes).toEqual(expect.objectContaining({
      testIndex: {
        partitionKey: 'test_table_gsi1_pk',
        sortKey: 'test_table_gsi1_sk',
        type: 'GSI',
      },
    }))

    TestTable.removeEntity(TestEntity)

    expect(TestTable.Table.indexes).toEqual(expect.objectContaining({
      testIndex: {
        partitionKey: 'test_table_gsi1_pk',
        sortKey: 'test_table_gsi1_sk',
        type: 'GSI',
      },
    }))
  })
})
