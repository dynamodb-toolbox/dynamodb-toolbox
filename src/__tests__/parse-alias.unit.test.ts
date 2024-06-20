import Table from '../classes/Table/Table.js'
import Entity from '../classes/Entity/Entity.js'
import { DocumentClient } from './bootstrap.test.js'

const TestTable = new Table({
  name: 'test-alias',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})

const TestEntity = new Entity({
  name: 'AliasTest',
  attributes: {
    pk: { type: 'string', partitionKey: true },
    sk: { type: 'string', sortKey: true },
    field: { type: 'set', setType: 'string' }
  },
  created: 'timeCreated',
  createdAlias: 'timeCreated',
  modified: 'timeUpdated',
  modifiedAlias: 'timeUpdated',
  table: TestTable
})

describe('Parse alias attributes', () => {
  test('successfully parse item with alias same as field', () => {
    const item = TestEntity.parse({
      pk: 'testPk',
      sk: 'testSk',
      field: new Set(['someField']),
      timeCreated: '2022-12-01T17:10:00Z',
      timeUpdated: '2022-12-01T19:10:00Z'
    })
    expect(item).toEqual({
      pk: 'testPk',
      sk: 'testSk',
      field: ['someField'],
      timeCreated: '2022-12-01T17:10:00Z',
      timeUpdated: '2022-12-01T19:10:00Z'
    })
  })
})
