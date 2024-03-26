import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { rejectExtraOptions } from 'v1/operations/utils/parseOptions/rejectExtraOptions'
import { parseCapacityOption } from 'v1/operations/utils/parseOptions/parseCapacityOption'
import { parseMetricsOption } from 'v1/operations/utils/parseOptions/parseMetricsOption'
import { parseClientRequestToken } from 'v1/operations/utils/parseOptions/parseClientRequestToken'

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
