import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { TableV2, DynamoDBToolboxError, ScanCommand } from 'v1'

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

describe('scan', () => {
  it('gets the tableName', async () => {
    const { TableName } = TestTable.build(ScanCommand).params()

    expect(TableName).toBe('test-table')
  })

  // Options
  it('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestTable.build(ScanCommand)
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('fails on invalid capacity option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          capacity: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.invalidCapacityOption' }))
  })

  it('sets consistent option', () => {
    const { ConsistentRead } = TestTable.build(ScanCommand).options({ consistent: true }).params()

    expect(ConsistentRead).toBe(true)
  })

  it('fails on invalid consistent option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          consistent: 'true'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'commands.invalidConsistentOption' })
    )
  })

  it('sets exclusiveStartKey option', () => {
    const { ExclusiveStartKey } = TestTable.build(ScanCommand)
      .options({ exclusiveStartKey: { foo: 'bar' } })
      .params()

    expect(ExclusiveStartKey).toStrictEqual({ foo: 'bar' })
  })

  it('sets indexName option', () => {
    const { IndexName } = TestTable.build(ScanCommand).options({ indexName: 'GSI1' }).params()

    expect(IndexName).toBe('GSI1')
  })

  it('fails on invalid indexName option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          indexName: { foo: 'bar' }
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'commands.invalidIndexNameOption' })
    )
  })

  it('sets limit option', () => {
    const { Limit } = TestTable.build(ScanCommand).options({ limit: 3 }).params()

    expect(Limit).toBe(3)
  })

  it('fails on invalid limit option', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          limit: '3'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.invalidLimitOption' }))
  })

  it('sets segment and totalSegments options', () => {
    const { Segment, TotalSegments } = TestTable.build(ScanCommand)
      .options({ segment: 3, totalSegments: 4 })
      .params()

    expect(Segment).toBe(3)
    expect(TotalSegments).toBe(4)
  })

  it('fails on invalid segment and/or totalSegments options', () => {
    // segment without totalSegment option
    const invalidCallA = () =>
      TestTable.build(ScanCommand)
        // @ts-expect-error
        .options({ segment: 3 })
        .params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid totalSegments (non number)
    const invalidCallB = () =>
      TestTable.build(ScanCommand)
        .options({
          segment: 3,
          // @ts-expect-error
          totalSegments: 'foo'
        })
        .params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid totalSegments (non-integer)
    const invalidCallC = () =>
      TestTable.build(ScanCommand)
        // Impossible to raise type error here
        .options({ segment: 3, totalSegments: 3.5 })
        .params()

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid totalSegments (negative integer)
    const invalidCallD = () =>
      TestTable.build(ScanCommand)
        // Impossible to raise type error here
        .options({ segment: 3, totalSegments: -1 })
        .params()

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid segment (non-number)
    const invalidCallE = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          segment: 'foo',
          totalSegments: 4
        })
        .params()

    expect(invalidCallE).toThrow(DynamoDBToolboxError)
    expect(invalidCallE).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid segment (non-integer)
    const invalidCallF = () =>
      TestTable.build(ScanCommand)
        // Impossible to raise type error here
        .options({ segment: 2.5, totalSegments: 4 })
        .params()

    expect(invalidCallF).toThrow(DynamoDBToolboxError)
    expect(invalidCallF).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid segment (negative integer)
    const invalidCallG = () =>
      TestTable.build(ScanCommand)
        // Impossible to raise type error here
        .options({ segment: -1, totalSegments: 4 })
        .params()

    expect(invalidCallG).toThrow(DynamoDBToolboxError)
    expect(invalidCallG).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )

    // invalid segment (above totalSegments)
    const invalidCallH = () =>
      TestTable.build(ScanCommand)
        // Impossible to raise type error here
        .options({ segment: 3, totalSegments: 3 })
        .params()

    expect(invalidCallH).toThrow(DynamoDBToolboxError)
    expect(invalidCallH).toThrow(
      expect.objectContaining({ code: 'scanCommand.invalidSegmentOption' })
    )
  })

  it('fails on extra options', () => {
    const invalidCall = () =>
      TestTable.build(ScanCommand)
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'commands.unknownOption' }))
  })
})
