import { BatchGetCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'

import { $entity } from '../class'
import { GetBatchItemRequest } from './getBatchItem'
import { BatchGetOptions } from './options'

export const buildBatchGetCommandInput = (
  commands: GetBatchItemRequest[],
  batchGetOptions: BatchGetOptions = {}
): BatchGetCommandInput => {
  const RequestItems: NonNullable<BatchGetCommandInput>['RequestItems'] = {}
  const Tables: { [key: string]: any } = {}
  const TableAliases: { [key: string]: any } = {}
  const EntityProjections: { [key: string]: any } = {}
  const TableProjections: { [key: string]: any } = {}

  if (commands.length === 0) {
    throw new DynamoDBToolboxError('operations.incompleteCommand', {
      message: 'BatchGet command incomplete: No items supplied'
    })
  }

  for (const command of commands) {
    const tableName = command[$entity].table.getName()

    if (!RequestItems[tableName]) {
      // Create a table property with an empty array
      RequestItems[tableName] = { Keys: [] }
    }
    RequestItems[tableName].Keys?.push(command.params())
  }

  batchGetOptions
  // const options = parseBatchGetOptions(batchGetOptions)

  return { RequestItems }
}
