import Table from '../classes/Table/Table.js'
import Entity from '../classes/Entity/Entity.js'

describe('Entity properties', () => {
  describe('table', () => {
    test('returns undefined if there is no table attached to the given entity', () => {
      const TestEntity = new Entity({
        name: 'TestEnt',
        attributes: {
          pk: { partitionKey: true }
        }
      } as const)

      expect(TestEntity.table).toBeUndefined()
    })

    test('returns the table attached to the given entity', () => {
      const TestTable = new Table({
        name: 'TestTable',
        partitionKey: 'pk'
      })

      const TestEntity = new Entity({
        name: 'TestEnt',
        attributes: {
          pk: { partitionKey: true }
        },
        table: TestTable
      } as const)

      expect(TestEntity.table).toStrictEqual(TestTable)
    })
  })

  describe('setTable', () => {
    test('sets the table on the given entity', () => {
      const TestTable = new Table({
        name: 'TestTable',
        partitionKey: 'pk',
        sortKey: 'sk'
      })

      const TestEntity = new Entity({
        name: 'TestEnt',
        attributes: {
          pk: { partitionKey: true },
          sk: { sortKey: true }
        }
      } as const)

      TestEntity.setTable(TestTable)

      expect(TestEntity.table).toStrictEqual(TestTable)
    })

    test('sets the _et field attributes mapping on the given entity', () => {
      const TestTable = new Table({
        name: 'TestTable',
        partitionKey: 'somePk',
        sortKey: 'someSk',
        entityField: 'entity_field'
      })

      const TestEntity = new Entity({
        name: 'TestEntity',
        attributes: {
          test_pk: { partitionKey: true },
          test_sk: { sortKey: true },
          test_string: { type: 'string' }
        },
        table: TestTable
      } as const)

      const TestTableV2 = new Table({
        name: 'TestTableV2',
        partitionKey: 'pk',
        sortKey: 'sk',
        entityField: 'entity_field_v2'
      } as const)

      TestEntity.setTable(TestTableV2)

      expect(TestEntity.schema.attributes).toEqual(
        expect.objectContaining({
          entity_field_v2: {
            alias: 'entity',
            type: 'string',
            hidden: false,
            default: 'TestEntity'
          },
          entity: {
            default: 'TestEntity',
            map: 'entity_field_v2',
            type: 'string'
          }
        })
      )
      expect(TestEntity.schema.attributes).not.toContain('entity_field')
      expect(TestEntity.defaults).toEqual(
        expect.objectContaining({
          entity_field_v2: 'TestEntity'
        })
      )
    })

    test('re-sets the _et field attributes mapping on the given entity when re-assigning a table to the given entity', () => {
      const TestTable = new Table({
        name: 'TestTable',
        partitionKey: 'pk',
        sortKey: 'sk',
        entityField: 'entity_field'
      })

      const TestEntity = new Entity({
        name: 'TestEntity',
        attributes: {
          test_pk: { partitionKey: true },
          test_sk: { sortKey: true },
          test_string: { type: 'string' }
        }
      } as const)

      // @ts-ignore
      TestEntity.setTable(TestTable)

      expect(TestEntity.schema.attributes).toEqual(
        expect.objectContaining({
          entity_field: {
            alias: 'entity',
            type: 'string',
            hidden: false,
            default: 'TestEntity'
          },
          entity: {
            default: 'TestEntity',
            map: 'entity_field',
            type: 'string'
          }
        })
      )
      expect(TestEntity.defaults).toEqual(
        expect.objectContaining({
          entity_field: 'TestEntity'
        })
      )
    })
  })

  test('fails when assigning an invalid Table', async () => {
    const InvalidTable = {
      name: 'InvalidTable'
    }

    expect(() => {
      // @ts-expect-error
      new Entity({
        name: 'TestEnt',
        attributes: {
          pk: { partitionKey: true }
        },
        table: InvalidTable
      } as const)
    }).toThrow('Entity TestEnt was assigned an invalid table')
  })

  test(`fails if trying to get 'DocumentClient' if not on table`, async () => {
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk'
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true }
      },
      table: TestTable
    } as const)

    expect(() => {
      TestEntity.DocumentClient
    }).toThrow(`DocumentClient required for this operation`)
  })

  test(`gets/sets the autoExecute and autoParse settings`, async () => {
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      autoExecute: false,
      autoParse: false
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true }
      },
      table: TestTable
    } as const)

    expect(TestEntity.autoExecute).toBe(false)
    expect(TestEntity.autoParse).toBe(false)

    TestEntity.autoExecute = true
    TestEntity.autoParse = true

    expect(TestEntity.autoExecute).toBe(true)
    expect(TestEntity.autoParse).toBe(true)
  })

  test(`gets the partitionKey and sortKey`, async () => {
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk'
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true },
        sk: { sortKey: true }
      },
      table: TestTable
    } as const)

    expect(TestEntity.partitionKey).toBe('pk')
    expect(TestEntity.sortKey).toBe('sk')
  })

  test(`gets a null sortKey`, async () => {
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk'
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true }
      },
      table: TestTable
    } as const)

    expect(TestEntity.sortKey).toBeNull()
  })

  test(`gets an attribute by name and mapping`, async () => {
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk'
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true },
        test: { map: 'sk' }
      },
      table: TestTable
    } as const)

    expect(TestEntity.attribute('pk')).toBe('pk')
    expect(TestEntity.attribute('test')).toBe('sk')
    expect(() => {
      TestEntity.attribute('missing')
    }).toThrow(`'missing' does not exist or is an invalid alias`)
  })
})
