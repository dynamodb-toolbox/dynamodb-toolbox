import { Table, Entity } from '../index.js'
import { DocumentClient } from './bootstrap.test.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})

const TestEntity = new Entity({
  name: 'TestEntity',
  autoExecute: false,
  attributes: {
    email: { type: 'string', partitionKey: true },
    sort: { type: 'string', sortKey: true },
    test_string: { type: 'string' }
  },
  table: TestTable
})

describe('putBatch', () => {
  it('fails when using an undefined schema field and strictSchemaCheck is not provided', () => {
    expect(() =>
      TestEntity.putBatch({
        email: 'test-pk',
        sort: 'test-sk',
        // @ts-expect-error
        unknown: '?'
      })
    ).toThrow(`Field 'unknown' does not have a mapping or alias`)
  })

  it('fails when using an undefined schema field and strictSchemaCheck is true', () => {
    expect(() =>
      TestEntity.putBatch(
        {
          email: 'test-pk',
          sort: 'test-sk',
          // @ts-expect-error
          unknown: '?'
        },
        {
          strictSchemaCheck: true
        }
      )
    ).toThrow(`Field 'unknown' does not have a mapping or alias`)
  })

  it('creates an item when using an undefined schema field and strictSchemaCheck is false', () => {
    expect(() =>
      TestEntity.putBatch(
        {
          email: 'test-pk',
          sort: 'test-sk',
          unknown: '?'
        },
        {
          strictSchemaCheck: false
        }
      )
    ).not.toThrow()
  })

  it('returns the result in the correct format', async () => {
    const result = TestEntity.putBatch({
      email: 'test-pk',
      sort: 'test-sk',
      test_string: 'test string'
    })

    expect(result).toEqual({
      [TestTable.name]: {
        PutRequest: {
          Item: expect.objectContaining({
            pk: 'test-pk',
            sk: 'test-sk',
            test_string: 'test string'
          })
        }
      }
    })
  })
})
