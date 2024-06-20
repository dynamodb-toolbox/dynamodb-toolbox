import Table from '../classes/Table/Table.js'
import Entity from '../classes/Entity/Entity.js'
import { DocumentClient } from './bootstrap.test.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  DocumentClient
})

const FormatEntity = new Entity({
  name: 'FormatEntity',
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
  test('format single item', () => {
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
})
