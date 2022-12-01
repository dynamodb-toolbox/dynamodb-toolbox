// Require Table and Entity classes
import Table from '../classes/Table'
import Entity from '../classes/Entity'
import { DocumentClient } from './bootstrap.test'

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
  modifiedAlias: 'timeUpdated'
})

const TestTable = new Table({
  name: 'test-alias',
  partitionKey: 'pk',
  sortKey: 'sk',
  entities: [TestEntity],
  DocumentClient
})

describe('alias-parse-test', () => {
  it('success parse item with alias same to field', () => {
    const item = TestEntity.parse({
      pk: 'testPk',
      sk: 'testSk',
      field: 'someField',
      timeCreated: '2022-12-01T17:10:00Z',
      timeUpdated: '2022-12-01T19:10:00Z'
    })
    expect(item).toEqual({
      pk: 'testPk',
      sk: 'testSk',
      field: 'someField',
      timeCreated: '2022-12-01T17:10:00Z',
      timeUpdated: '2022-12-01T19:10:00Z'
    })
  })
})
