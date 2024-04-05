import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { rejectExtraOptions } from 'v1/options/rejectExtraOptions'
import { parseCapacityOption } from 'v1/options/capacity'
import { parseMetricsOption } from 'v1/options/metrics'
import { parseClientRequestToken } from 'v1/options/clientRequestToken'

import type { TransactWriteOptions } from './options'

type TransactWriteCommandOptions = Partial<Omit<TransactWriteCommandInput, 'TransactItems'>>

export const parseTransactWriteOptions = (
  transactWriteOptions: TransactWriteOptions
): TransactWriteCommandOptions => {
  const commandOptions: TransactWriteCommandOptions = {}

  const { clientRequestToken, capacity, metrics, ...extraOptions } = transactWriteOptions
  rejectExtraOptions(extraOptions)

  if (clientRequestToken !== undefined) {
    commandOptions.ClientRequestToken = parseClientRequestToken(clientRequestToken)
  }

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  return commandOptions
}
