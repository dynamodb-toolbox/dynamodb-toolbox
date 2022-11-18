import { DocumentClient } from './bootstrap.test'

// Import Table and Entity classes
import Table from '../classes/Table'
import Entity from '../classes/Entity'

// Create basic table
const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  DocumentClient
})

const FormatEntity = new Entity({
  // Specify entity name
  name: 'FormatEntity',

  // Define attributes
  attributes: {
    pk: { type: 'string', partitionKey: true },
    formatted_field: {
      type: 'string',
      format: (value: string) => value.toUpperCase()
    },
    formatted_field_2: {
      type: 'number',
      format: (value: number) => value.toFixed(1)
    }
  },
  table: TestTable
} as const)

describe('format', () => {
  it('format single item', () => {
    const item = FormatEntity.parse({
      pk: 'test@test.com',
      formatted_field: 'test',
      formatted_field_2: 100.123,
      _et: 'TestEntity'
    })
    expect(item).toEqual({
      pk: 'test@test.com',
      formatted_field: 'TEST',
      formatted_field_2: '100.1',
      entity: 'TestEntity'
    })
  })
}) // end format
