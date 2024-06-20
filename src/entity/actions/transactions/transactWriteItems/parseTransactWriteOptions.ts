import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { parseCapacityOption } from '~/options/capacity.js'
import { parseClientRequestToken } from '~/options/clientRequestToken.js'
import { parseMetricsOption } from '~/options/metrics.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import type { TransactWriteOptions } from './options.js'

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
