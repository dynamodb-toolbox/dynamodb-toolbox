import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { parseCapacityOption } from 'v1/options/capacity'
import { parseMetricsOption } from 'v1/options/metrics'
import { rejectExtraOptions } from 'v1/options/rejectExtraOptions'

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
