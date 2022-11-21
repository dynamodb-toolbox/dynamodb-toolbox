// Require Table and Entity classes
import Table from '../classes/Table'
import Entity from '../classes/Entity'

describe('Entity properties', () => {
  describe('table', () => {
    it('returns undefined if there is no table attached to the given entity', async () => {
      const TestEntity = new Entity({
        name: 'TestEnt',
        attributes: {
          pk: { partitionKey: true },
        },
      } as const)

      expect(() => {
        TestEntity.table
      }).toThrow(`The 'TestEnt' entity must be attached to a Table to perform this operation`)
    })
  })

  it('fails if trying to add a table when one already exists', async () => {
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
      TestEntity.table = TestTable
    }).toThrow('This entity is already assigned a Table (test-table)')
  })

  it('fails if assigning an invalid Table', async () => {
    const InvalidTable = {}

    expect(() => {
      // Create basic entity
      // @ts-expect-error
      new Entity({
        name: 'TestEnt',
        attributes: {
          pk: { partitionKey: true },
        },
        table: InvalidTable,
      } as const)
    }).toThrow('Invalid Table')
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
