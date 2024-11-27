import { BatchWriteCommand as _BatchWriteCommand } from '@aws-sdk/lib-dynamodb'
import type {
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import type { CapacityOption } from '~/options/capacity.js'
import { parseMetricsOption } from '~/options/metrics.js'
import type { MetricsOption } from '~/options/metrics.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
import { isEmpty } from '~/utils/isEmpty.js'

import { BatchWriteCommand } from './batchWriteCommand.js'

export type ExecuteBatchWriteInput =
  | [ExecuteBatchWriteOptions, ...BatchWriteCommand[]]
  | BatchWriteCommand[]

export interface ExecuteBatchWriteOptions extends DocumentClientOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
  documentClient?: DynamoDBDocumentClient
  maxAttempts?: number
}

export const execute = async (
  ..._commands: ExecuteBatchWriteInput
): Promise<BatchWriteCommandOutput> => {
  const [headCommandOrOptions = {}, ...tailCommands] = _commands

  const commands = tailCommands as BatchWriteCommand[]
  let options: ExecuteBatchWriteOptions = {}

  if (headCommandOrOptions instanceof BatchWriteCommand) {
    commands.unshift(headCommandOrOptions)
  } else {
    options = headCommandOrOptions
  }

  const firstCommand = commands[0]
  if (firstCommand === undefined) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'Cannot execute BatchWriteCommands: No BatchWriteCommand supplied'
    })
  }

  const { maxAttempts = 1, metrics, capacity, documentClient, ...documentClientOptions } = options
  const docClient = documentClient ?? firstCommand.table.getDocumentClient()

  const { RequestItems: initialRequestItems, ...commandOptions } = getCommandInput(commands, {
    metrics,
    capacity
  })

  let attemptCount = 0
  let requestItems: BatchWriteCommandInput['RequestItems'] = initialRequestItems
  let unprocessedItems: BatchWriteCommandOutput['UnprocessedItems'] = {}
  let consumedCapacity: BatchWriteCommandOutput['ConsumedCapacity'] = undefined
  let collectionMetrics: BatchWriteCommandOutput['ItemCollectionMetrics'] = undefined
  let responseMetadata: BatchWriteCommandOutput['$metadata'] = {}

  do {
    attemptCount += 1

    const {
      UnprocessedItems: attemptUnprocessedItems = {},
      ConsumedCapacity: attemptConsumedCapacity,
      ItemCollectionMetrics: attemptCollectionMetrics,
      $metadata: attemptMetadata
    } = await docClient.send(
      new _BatchWriteCommand({ RequestItems: requestItems, ...commandOptions }),
      documentClientOptions
    )

    requestItems = attemptUnprocessedItems
    unprocessedItems = attemptUnprocessedItems
    consumedCapacity = attemptConsumedCapacity
    collectionMetrics = attemptCollectionMetrics
    responseMetadata = attemptMetadata
  } while (attemptCount < maxAttempts && !isEmpty(unprocessedItems))

  return {
    ...(unprocessedItems !== undefined ? { UnprocessedItems: unprocessedItems } : {}),
    $metadata: {},
    // return ConsumedCapacity, ItemCollectionMetrics & $metadata only if one attempt has been tried
    ...(attemptCount === 1
      ? {
          ...(consumedCapacity !== undefined ? { ConsumedCapacity: consumedCapacity } : {}),
          ...(collectionMetrics !== undefined ? { ItemCollectionMetrics: collectionMetrics } : {}),
          ...(responseMetadata !== undefined ? { $metadata: responseMetadata } : {})
        }
      : {})
  }
}

export const getCommandInput = (
  commands: BatchWriteCommand[],
  options: ExecuteBatchWriteOptions = {}
): BatchWriteCommandInput => {
  const requestItems: NonNullable<BatchWriteCommandInput>['RequestItems'] = {}

  if (commands.length === 0) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'batchWrite arguments incomplete: No BatchWriteCommand supplied'
    })
  }

  for (const command of commands) {
    const commandParams = command.params()

    for (const tableName of Object.keys(commandParams)) {
      if (tableName in requestItems) {
        throw new DynamoDBToolboxError('actions.invalidAction', {
          message: `Two BatchWriteCommands detected for table: ${tableName}. Please provide only one BatchWriteCommand per table`
        })
      }
    }

    Object.assign(requestItems, commandParams)
  }

  const { capacity, metrics } = options

  return {
    RequestItems: requestItems,
    ...(capacity !== undefined ? { ReturnConsumedCapacity: parseCapacityOption(capacity) } : {}),
    ...(metrics !== undefined ? { ReturnItemCollectionMetrics: parseMetricsOption(metrics) } : {})
  }
}
