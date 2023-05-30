import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { TableV2, EntityV2, schema, string, DynamoDBToolboxError, GetItemCommand } from 'v1'

const dynamoDbClient = new DynamoDBClient({})

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)

const TestTable = new TableV2({
  name: 'test-table',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  sortKey: {
    type: 'string',
    name: 'sk'
  },
  documentClient
})

const TestEntity = new EntityV2({
  name: 'TestEntity',
  schema: schema({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test: string()
  }),
  table: TestTable
} as const)

const TestTable2 = new TableV2({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const TestEntity2 = new EntityV2({
  name: 'TestEntity',
  schema: schema({
    pk: string().key(),
    sk: string().key(),
    test: string()
  }),
  table: TestTable2
})

describe('get', () => {
  it('gets the key from inputs', async () => {
    const { TableName, Key } = TestEntity.build(GetItemCommand)
      .key({
        email: 'test-pk',
        sort: 'test-sk'
      })
      .params()

    expect(TableName).toBe('test-table')
    expect(Key).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data', async () => {
    const { Key } = TestEntity.build(GetItemCommand)
      .key({
        email: 'test-pk',
        sort: 'test-sk',
        // @ts-expect-error
        test: 'test'
      })
      .params()

    expect(Key).not.toHaveProperty('test')
  })

  it('fails with undefined input', () => {
    expect(() =>
      TestEntity.build(GetItemCommand)
        .key(
          // @ts-expect-error
          {}
        )
        .params()
    ).toThrow('Attribute email is required')
  })

  it('fails when missing the sortKey', () => {
    expect(() =>
      TestEntity.build(GetItemCommand)
        .key(
          // @ts-expect-error
          { pk: 'test-pk' }
        )
        .params()
    ).toThrow('Attribute email is required')
  })

  it('fails when missing partitionKey (no alias)', () => {
    expect(() =>
      TestEntity2.build(GetItemCommand)
        .key(
          // @ts-expect-error
          {}
        )
        .params()
    ).toThrow('Attribute pk is required')
  })

  it('fails when missing the sortKey (no alias)', () => {
    expect(() =>
      TestEntity2.build(GetItemCommand)
        .key(
          // @ts-expect-error
          { pk: 'test-pk' }
        )
        .params()
    ).toThrow('Attribute sk is required')
  })

  // Options
  it('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestEntity.build(GetItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('fails on invalid capacity option', () => {
    const invalidCall = () =>
      TestEntity.build(GetItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          capacity: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.invalidCapacityOption' }))
  })

  it('sets consistent and capacity options', () => {
    const { ConsistentRead } = TestEntity.build(GetItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ consistent: true })
      .params()

    expect(ConsistentRead).toBe(true)
  })

  it('fails on invalid consistent option', () => {
    const invalidCall = () =>
      TestEntity.build(GetItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          consistent: 'true'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'getItemCommand.invalidConsistentOption' })
    )
  })

  it('fails on extra options', () => {
    const invalidCall = () =>
      TestEntity.build(GetItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.unknownOption' }))
  })

  it('parses attribute projections', () => {
    const { ExpressionAttributeNames, ProjectionExpression } = TestEntity.build(GetItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ attributes: ['email'] })
      .params()

    expect(ExpressionAttributeNames).toEqual({ '#1': 'pk' })
    expect(ProjectionExpression).toBe('#1')
  })

  it('missing key', () => {
    const invalidCall = () => TestEntity.build(GetItemCommand).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.incompleteCommand' }))
  })

  // TODO Create getBatch method and move tests there
  // it('formats a batch get response', async () => {
  //   let { Table, Key } = TestEntity.getBatch({ email: 'a', sort: 'b' })
  //   expect(Table.name).toBe('test-table')
  //   expect(Key).toEqual({ pk: 'a', sk: 'b' })
  // })

  // it('fails if no value is provided to the getBatch method', () => {
  //   // @ts-expect-error
  //   expect(() => TestEntity.getBatch()).toThrow(`'pk' or 'email' is required`)
  // })
})
