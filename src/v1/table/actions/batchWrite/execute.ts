import {
  BatchWriteCommand as _BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'
import { CapacityOption, parseCapacityOption } from 'v1/options/capacity'
import { MetricsOption, parseMetricsOption } from 'v1/options/metrics'
import { $table } from 'v1/table/table'

import { BatchWriteCommand } from './batchWriteCommand'

export interface ExecuteBatchWriteOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
  documentClient?: DynamoDBDocumentClient
}

export const execute = async (
  ..._commands: [ExecuteBatchWriteOptions, ...BatchWriteCommand[]] | BatchWriteCommand[]
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

  const documentClient = options.documentClient ?? firstCommand[$table].getDocumentClient()

  const commandInput = getCommandInput(commands, options)

  return documentClient.send(new _BatchWriteCommand(commandInput))
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
    const tableName = command[$table].getName()

    if (tableName in requestItems) {
      // TODO
      throw new DynamoDBToolboxError('actions.incompleteAction', { message: '' })
    }

    requestItems[tableName] = command.params()
  }

  const { capacity, metrics } = options

  return {
    RequestItems: requestItems,
    ...(capacity !== undefined ? { ReturnConsumedCapacity: parseCapacityOption(capacity) } : {}),
    ...(metrics !== undefined ? { ReturnItemCollectionMetrics: parseMetricsOption(metrics) } : {})
  }
}
