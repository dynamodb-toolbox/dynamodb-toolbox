import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { parseMetricsOption } from 'v1/commands/utils/parseOptions/parseMetricsOption'
import { parseReturnValuesOption } from 'v1/commands/utils/parseOptions/parseReturnValuesOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'

import { deleteItemCommandReturnValuesOptionsSet, DeleteItemOptions } from '../options'

type CommandOptions = Omit<DeleteCommandInput, 'TableName' | 'Key'>

export const parseDeleteItemOptions = (deleteItemOptions: DeleteItemOptions): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, ...extraOptions } = deleteItemOptions

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  if (returnValues !== undefined) {
    commandOptions.ReturnValues = parseReturnValuesOption(
      deleteItemCommandReturnValuesOptionsSet,
      returnValues
    )
  }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
