import { DynamoDBToolboxError, EntityV2, TableV2, schema, string, BatchPutItemRequest } from 'v1'

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

describe('BatchPutItem', () => {
  it('returns the result in the correct format', async () => {
    const { Item } = TestEntity.build(BatchPutItemRequest)
      .item({ email: 'test-pk', sort: 'test-sk', test_string: 'test string' })
      .params()

    expect(Item).toMatchObject({
      pk: 'test-pk',
      sk: 'test-sk',
      test_string: 'test string'
    })
  })

  it('fails if no item is provided', () => {
    const invalidCall = () => TestEntity.build(BatchPutItemRequest).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })
})
