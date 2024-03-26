import { DynamoDBToolboxError, EntityV2, TableV2, schema, string, BatchDeleteItemRequest } from 'v1'

const TestTable = new TableV2({
  name: 'test-table',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  sortKey: {
    type: 'string',
    name: 'sk'
  }
})

const TestEntity = new EntityV2({
  name: 'TestEntity',
  schema: schema({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test_string: string()
  }),
  table: TestTable
})

describe('BatchDeleteItem', () => {
  it('returns the result in the correct format', async () => {
    const { Key } = TestEntity.build(BatchDeleteItemRequest)
      .key({ email: 'test-pk', sort: 'test-sk' })
      .params()

    expect(Key).toMatchObject({
      pk: 'test-pk',
      sk: 'test-sk'
    })
  })

  it('fails if no key is provided', () => {
    const invalidCall = () => TestEntity.build(BatchDeleteItemRequest).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.incompleteOperation' }))
  })
})
