import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'
import { $entity } from 'v1/entity'

import { BatchWriteItemRequest, $requestType } from './BatchWriteItemRequest'
import type { BatchWriteOptions } from './options'
import { parseBatchWriteOptions } from './parseBatchWriteOptions'

/**
 * Send a collection of `BatchWriteItemRequest`
 *
 * @param requests
 * @param options
 */
export const batchWrite = async (
  requests: BatchWriteItemRequest[],
  options: {
    /** Options passed to top-level BatchWrite */
    batchWriteOptions?: BatchWriteOptions
    /** Optional DynamoDB client. If not provided, the client linked to the first request is used. */
    dynamoDBDocumentClient?: DynamoDBDocumentClient
  } = {}
): Promise<BatchWriteCommandOutput> => {
  const documentClient =
    options?.dynamoDBDocumentClient ?? requests[0][$entity].table.getDocumentClient()

  const commandInput = getBatchWriteCommandInput(requests, options?.batchWriteOptions)

  return documentClient.send(new BatchWriteCommand(commandInput))
}

export const getBatchWriteCommandInput = (
  requests: BatchWriteItemRequest[],
  batchWriteOptions: BatchWriteOptions = {}
): BatchWriteCommandInput => {
  const RequestItems: NonNullable<BatchWriteCommandInput>['RequestItems'] = {}

  if (requests.length === 0) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'BatchWrite command incomplete: No items supplied'
    })
  }

  for (const request of requests) {
    const tableName = request[$entity].table.getName()

    if (RequestItems[tableName] === undefined) RequestItems[tableName] = []

    RequestItems[tableName].push({
      [request[$requestType]]: request.params()
    })
  }

  const options = parseBatchWriteOptions(batchWriteOptions)

  return { RequestItems, ...options }
}
