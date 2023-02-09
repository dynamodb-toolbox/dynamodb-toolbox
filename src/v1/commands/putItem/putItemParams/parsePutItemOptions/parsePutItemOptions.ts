import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { capacityOptionsSet } from 'v1/commands/options'

import { metricsOptionsSet, returnValuesOptionsSet, PutItemOptions } from '../../options'

type CommandOptions = Omit<PutCommandInput, 'TableName' | 'Item'>

export const parsePutItemOptions = (putItemOptions: PutItemOptions): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, ...extraOptions } = putItemOptions

  if (capacity !== undefined) {
    // TODO Factorize with parseGetItemOptions
    if (!capacityOptionsSet.has(capacity)) {
      throw new DynamoDBToolboxError('invalidCommandCapacityOption', {
        message: `Invalid capacity option: '${String(capacity)}'. 'capacity' must be one of: ${[
          ...capacityOptionsSet
        ].join(', ')}.`,
        payload: { capacity }
      })
    } else {
      commandOptions.ReturnConsumedCapacity = capacity
    }
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

  const [extraOption] = Object.keys(extraOptions)
  if (extraOption !== undefined) {
    // TODO Factorize with parseGetItemOptions
    throw new DynamoDBToolboxError('unknownCommandOption', {
      message: `Unkown option: ${extraOption}.`,
      payload: { option: extraOption }
    })
  }

  return commandOptions
}
