import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors/dynamoDbToolboxError'

import {
  capacityOptionsSet,
  metricsOptionsSet,
  returnValuesOptionsSet,
  PutItemOptions
} from '../../options'

type CommandOptions = Omit<PutCommandInput, 'TableName' | 'Item'>

export const parsePutItemOptions = (putItemOptions: PutItemOptions): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, ...extraOptions } = putItemOptions

  if (capacity !== undefined) {
    if (!capacityOptionsSet.has(capacity)) {
      throw new DynamoDBToolboxError('invalidCapacityOption', {
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
      throw new DynamoDBToolboxError('invalidMetricsOption', {
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
      throw new DynamoDBToolboxError('invalidReturnValuesOption', {
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
    throw new DynamoDBToolboxError('unknownOption', {
      message: `Unkown option: ${extraOption}.`,
      payload: { option: extraOption }
    })
  }

  return commandOptions
}
