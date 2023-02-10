import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { parseMetricsOption } from 'v1/commands/utils/parseOptions/parseMetricsOption'
import { parseReturnValuesOption } from 'v1/commands/utils/parseOptions/parseReturnValuesOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'

import { putItemCommandReturnValuesOptionsSet, PutItemOptions } from '../options'

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
    commandOptions.ReturnValues = parseReturnValuesOption(
      putItemCommandReturnValuesOptionsSet,
      returnValues
    )
  }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
