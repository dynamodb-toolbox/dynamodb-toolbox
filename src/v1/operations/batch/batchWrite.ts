import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput
} from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'

import type { BatchWriteRequestInterface } from './BatchWriteRequestInterface'
import { $requestType } from './BatchWriteRequestInterface'
import type { BatchWriteOptions } from './options'
import { parseBatchWriteOptions } from './parseBatchWriteOptions'
import { $entity } from '../class'

export const batchWrite = async (
  commands: BatchWriteRequestInterface[],
  options: BatchWriteOptions = {}
): Promise<BatchWriteCommandOutput> => {
  const commandInput = buildBatchWriteCommandInput(commands, options)

  return commands[0][$entity].table.documentClient.send(new BatchWriteCommand(commandInput))
}

export const buildBatchWriteCommandInput = (
  commands: BatchWriteRequestInterface[],
  batchWriteOptions: BatchWriteOptions = {}
): BatchWriteCommandInput => {
  const RequestItems: NonNullable<BatchWriteCommandInput>['RequestItems'] = {}

  if (commands.length === 0) {
    throw new DynamoDBToolboxError('operations.incompleteCommand', {
      message: 'BatchWrite command incomplete: No items supplied'
    })
  }

  for (const command of commands) {
    const tableName = command[$entity].table.getName()

    if (RequestItems[tableName] === undefined) RequestItems[tableName] = []

    RequestItems[tableName].push({
      [command[$requestType]]: command.params()
    })
  }

  const options = parseBatchWriteOptions(batchWriteOptions)

  return { RequestItems, ...options }
}
