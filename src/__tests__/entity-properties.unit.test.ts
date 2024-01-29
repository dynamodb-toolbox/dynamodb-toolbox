
import Table from '../classes/Table/Table.js'
import Entity from '../classes/Entity/Entity.js'
import { Equals } from 'ts-toolbelt/out/Any/Equals.js'
import { DocumentClient } from './bootstrap.test.js'
import { GetCommandOutput } from '@aws-sdk/lib-dynamodb'

describe('Entity properties', () => {
  describe('table', () => {
    it('returns undefined if there is no table attached to the given entity', () => {
      const TestEntity = new Entity({
        name: 'TestEnt',
        attributes: {
          pk: { partitionKey: true },
        },
      } as const)

      expect(TestEntity.table).toBeUndefined()
    })

    it('returns the table attached to the given entity', () => {
      const TestTable = new Table({
        name: 'TestTable',
        partitionKey: 'pk',
      })

      const TestEntity = new Entity({
        name: 'TestEnt',
        attributes: {
          pk: { partitionKey: true },
        },
        table: TestTable,
      } as const)

      expect(TestEntity.table).toStrictEqual(TestTable)
    })
  })

  describe('setTable', () => {
    it('sets the table on the given entity', () => {
      const TestTable = new Table({
        name: 'TestTable',
        partitionKey: 'pk',
        sortKey: 'sk',
      })

      const TestEntity = new Entity({
        name: 'TestEnt',
        attributes: {
          pk: { partitionKey: true },
          sk: { sortKey: true },
        },
      } as const)

      TestEntity.setTable(TestTable)

      expect(TestEntity.table).toStrictEqual(TestTable)
    })

    it('sets the _et field attributes mapping on the given entity', () => {
      const TestTable = new Table({
        name: 'TestTable',
        partitionKey: 'somePk',
        sortKey: 'someSk',
        entityField: 'entity_field',
      })

      const TestEntity = new Entity({
        name: 'TestEntity',
        attributes: {
          test_pk: { partitionKey: true },
          test_sk: { sortKey: true },
          test_string: { type: 'string' },
        },
        table: TestTable,
      } as const)

      const TestTableV2 = new Table({
        name: 'TestTableV2',
        partitionKey: 'pk',
        sortKey: 'sk',
        entityField: 'entity_field_v2',
      } as const)

      TestEntity.setTable(TestTableV2)

      expect(TestEntity.schema.attributes).toEqual(expect.objectContaining({
        entity_field_v2: {
          alias: 'entity',
          type: 'string',
          hidden: false,
          default: 'TestEntity',
        },
        entity: {
          'default': 'TestEntity',
          'map': 'entity_field_v2',
          'type': 'string',
        },
      }))
      expect(TestEntity.schema.attributes).not.toContain('entity_field')
      expect(TestEntity.defaults).toEqual(expect.objectContaining({
        entity_field_v2: 'TestEntity',
      }))
    })

    it(
      're-sets the _et field attributes mapping on the given entity when re-assigning a table to the given entity',
      () => {
        const TestTable = new Table({
          name: 'TestTable',
          partitionKey: 'pk',
          sortKey: 'sk',
          entityField: 'entity_field',
        })

        const TestEntity = new Entity({
          name: 'TestEntity',
          attributes: {
            test_pk: { partitionKey: true },
            test_sk: { sortKey: true },
            test_string: { type: 'string' },
          },
        } as const)

        // @ts-ignore
        TestEntity.setTable(TestTable)

        expect(TestEntity.schema.attributes).toEqual(expect.objectContaining({
          entity_field: {
            alias: 'entity',
            type: 'string',
            hidden: false,
            default: 'TestEntity',
          },
          entity: {
            'default': 'TestEntity',
            'map': 'entity_field',
            'type': 'string',
          },
        }))
        expect(TestEntity.defaults).toEqual(expect.objectContaining({
          entity_field: 'TestEntity',
        }))
      },
    )
  })

  it('fails when assigning an invalid Table', async () => {
    const InvalidTable = {
      name: 'InvalidTable',
    }

    expect(() => {
      // @ts-expect-error
      new Entity({
        name: 'TestEnt',
        attributes: {
          pk: { partitionKey: true },
        },
        table: InvalidTable,
      } as const)
    }).toThrow('Entity TestEnt was assigned an invalid table')
  })

  it(`fails if trying to get 'DocumentClient' if not on table`, async () => {
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true },
      },
      table: TestTable,
    } as const)

    expect(() => {
      TestEntity.DocumentClient
    }).toThrow(`DocumentClient required for this operation`)
  })

  it(`gets/sets the autoExecute and autoParse settings`, async () => {
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      autoExecute: false,
      autoParse: false,
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true },
      },
      table: TestTable,
    } as const)

    expect(TestEntity.autoExecute).toBe(false)
    expect(TestEntity.autoParse).toBe(false)

    TestEntity.autoExecute = true
    TestEntity.autoParse = true

    expect(TestEntity.autoExecute).toBe(true)
    expect(TestEntity.autoParse).toBe(true)
  })

  it(`gets the partitionKey and sortKey`, async () => {
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true },
        sk: { sortKey: true },
      },
      table: TestTable,
    } as const)

    expect(TestEntity.partitionKey).toBe('pk')
    expect(TestEntity.sortKey).toBe('sk')
  })

  it(`gets a null sortKey`, async () => {
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true },
      },
      table: TestTable,
    } as const)

    expect(TestEntity.sortKey).toBeNull()
  })

  it(`gets an attribute by name and mapping`, async () => {
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true },
        test: { map: 'sk' },
      },
      table: TestTable,
    } as const)

    expect(TestEntity.attribute('pk')).toBe('pk')
    expect(TestEntity.attribute('test')).toBe('sk')
    expect(() => {
      TestEntity.attribute('missing')
    }).toThrow(`'missing' does not exist or is an invalid alias`)
  })
})


describe('Extended classes behave as expected', () => {
  const config = {
    name: 'TestEnt',
    attributes: {
      pk: { partitionKey: true },
      test: { map: 'sk' },
    },
    autoParse: false,
    table: new Table({
      name: 'base-table',
      partitionKey: 'pk',
      DocumentClient,
    }),
  } as const
  
  class TestEntityExtended extends Entity {
    constructor() {
      super(config)
    }
  }

  it(`get, update, put  method on base class will be fine`, async () => {
    const baseEntity = new Entity(config);
    const res = baseEntity.get({ pk: 'foo' })

    type TestExtends = Equals<typeof res, Promise<GetCommandOutput>>
    const testExtends: TestExtends = 1 //
    expect(testExtends).toBe(1)
  })


  it(`get method in derived class should return GetCommandOutput if autoExecute is configured`, async () => {
    const testEntity = new TestEntityExtended()
    const res = testEntity.get({ pk: 'foo' })
    type TestExtends = Equals<typeof res, Promise<GetCommandOutput>>
    const testExtends: TestExtends = 1
    expect(testExtends).toBe(1)
  })

  it(`get method in derived class should return GetCommandOutput if autoExecute false but execute parameter passed`, async () => {
    const TestEntity = new TestEntityExtended()
    const res = TestEntity.get({ pk: 'foo' }, { execute: true })
    type TestExtends = Equals<typeof res, Promise<GetCommandOutput>>
    const testExtends: TestExtends = 1
    expect(testExtends).toBe(1)
  })
})
