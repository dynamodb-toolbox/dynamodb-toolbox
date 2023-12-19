import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { parseCapacityOption } from 'v1/operations/utils/parseOptions/parseCapacityOption'
import { parseMetricsOption } from 'v1/operations/utils/parseOptions/parseMetricsOption'
import { rejectExtraOptions } from 'v1/operations/utils/parseOptions/rejectExtraOptions'

import type { BatchWriteOptions } from './options'

export type CommandOptions = Omit<BatchWriteCommandInput, 'RequestItems'>

export const parseBatchWriteOptions = (options: BatchWriteOptions): CommandOptions => {
  const commandOptions: CommandOptions = {}
  const { capacity, metrics, ...extraOptions } = options

  rejectExtraOptions(extraOptions)

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  return commandOptions
}
