import { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'

import type { BatchWriteItemRequest } from './BatchWriteItemRequest'
import { $entity } from '../class'

export const getBatchWriteCommandInput = (
  requests: BatchWriteItemRequest[]
): BatchWriteCommandInput => {
  const RequestItems: NonNullable<BatchWriteCommandInput>['RequestItems'] = {}

  if (requests.length === 0) {
    throw new DynamoDBToolboxError('operations.incompleteCommand', {
      message: 'BatchWrite command incomplete: No items supplied'
    })
  }

  for (const request of requests) {
    const tableName = request[$entity].table.getName()

    if (RequestItems[tableName] === undefined) RequestItems[tableName] = []

    RequestItems[tableName].push({
      [request.requestType]: request.params()
    })
  }
  return { RequestItems }
}
