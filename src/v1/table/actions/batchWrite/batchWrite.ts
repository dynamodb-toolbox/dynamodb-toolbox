import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'
import { CapacityOption, parseCapacityOption } from 'v1/options/capacity'
import { MetricsOption, parseMetricsOption } from 'v1/options/metrics'
import { $table } from 'v1/table/table'

import { BatchWriteTableItemsRequest } from './batchWriteTableItems'

export interface BatchWriteOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
  documentClient?: DynamoDBDocumentClient
}

export const batchWrite = async (
  headRequestOrOptions: BatchWriteTableItemsRequest | BatchWriteOptions,
  ...tailRequests: BatchWriteTableItemsRequest[]
): Promise<BatchWriteCommandOutput> => {
  const requests: BatchWriteTableItemsRequest[] = tailRequests
  let options: BatchWriteOptions = {}

  if (headRequestOrOptions instanceof BatchWriteTableItemsRequest) {
    requests.unshift(headRequestOrOptions)
  } else {
    options = headRequestOrOptions
  }

  const firstRequest = requests[0]
  if (firstRequest === undefined) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'batchWrite incomplete: No BatchWriteTableItemsRequest supplied'
    })
  }

  const documentClient = options.documentClient ?? firstRequest[$table].getDocumentClient()

  const commandInput = getBatchWriteCommandInput(requests, options)

  return documentClient.send(new BatchWriteCommand(commandInput))
}

export const getBatchWriteCommandInput = (
  requests: BatchWriteTableItemsRequest[],
  options: BatchWriteOptions = {}
): BatchWriteCommandInput => {
  const requestItems: NonNullable<BatchWriteCommandInput>['RequestItems'] = {}

  if (requests.length === 0) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'batchWrite arguments incomplete: No BatchWriteTableItemsRequest supplied'
    })
  }

  for (const request of requests) {
    const tableName = request[$table].getName()

    if (tableName in requestItems) {
      throw new DynamoDBToolboxError('actions.incompleteAction', { message: '' })
    }

    requestItems[tableName] = request.params()
  }

  const { capacity, metrics } = options

  return {
    RequestItems: requestItems,
    ...(capacity !== undefined ? { ReturnConsumedCapacity: parseCapacityOption(capacity) } : {}),
    ...(metrics !== undefined ? { ReturnItemCollectionMetrics: parseMetricsOption(metrics) } : {})
  }
}
