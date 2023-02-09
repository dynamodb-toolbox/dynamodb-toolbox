import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { parseMetricsOption } from 'v1/commands/utils/parseOptions/parseMetricsOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'

import { DeleteItemOptions } from '../../options'

type CommandOptions = Omit<DeleteCommandInput, 'TableName' | 'Key'>

export const parseDeleteItemOptions = (deleteItemOptions: DeleteItemOptions): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, ...extraOptions } = deleteItemOptions

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  // if (returnValues !== undefined) {
  //   if (!returnValuesOptionsSet.has(returnValues)) {
  //     throw new DynamoDBToolboxError('invalidPutItemCommandReturnValuesOption', {
  //       message: `Invalid returnValues option: '${String(
  //         returnValues
  //       )}'. 'returnValues' must be one of: ${[...returnValuesOptionsSet].join(', ')}.`,
  //       payload: { returnValues }
  //     })
  //   } else {
  //     commandOptions.ReturnValues = returnValues
  //   }
  // }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
