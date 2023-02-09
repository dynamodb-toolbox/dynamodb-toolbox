import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { parseMetricsOption } from 'v1/commands/utils/parseOptions/parseMetricsOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'

import { returnValuesOptionsSet, PutItemOptions } from '../../options'

type CommandOptions = Omit<PutCommandInput, 'TableName' | 'Item'>

export const parsePutItemOptions = (putItemOptions: PutItemOptions): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, ...extraOptions } = putItemOptions

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  if (returnValues !== undefined) {
    if (!returnValuesOptionsSet.has(returnValues)) {
      throw new DynamoDBToolboxError('invalidPutItemCommandReturnValuesOption', {
        message: `Invalid returnValues option: '${String(
          returnValues
        )}'. 'returnValues' must be one of: ${[...returnValuesOptionsSet].join(', ')}.`,
        payload: { returnValues }
      })
    } else {
      commandOptions.ReturnValues = returnValues
    }
  }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
