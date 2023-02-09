import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'

import { metricsOptionsSet, returnValuesOptionsSet, PutItemOptions } from '../../options'

type CommandOptions = Omit<PutCommandInput, 'TableName' | 'Item'>

export const parsePutItemOptions = (putItemOptions: PutItemOptions): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, ...extraOptions } = putItemOptions

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    if (!metricsOptionsSet.has(metrics)) {
      throw new DynamoDBToolboxError('invalidPutItemCommandMetricsOption', {
        message: `Invalid metrics option: '${String(metrics)}'. 'metrics' must be one of: ${[
          ...metricsOptionsSet
        ].join(', ')}.`,
        payload: { metrics }
      })
    } else {
      commandOptions.ReturnItemCollectionMetrics = metrics
    }
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
