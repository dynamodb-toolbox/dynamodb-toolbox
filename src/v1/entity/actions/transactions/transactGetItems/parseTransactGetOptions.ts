import type { TransactGetCommandInput } from '@aws-sdk/lib-dynamodb'

import { parseCapacityOption } from 'v1/options/capacity.js'
import { rejectExtraOptions } from 'v1/options/rejectExtraOptions.js'

import type { TransactGetOptions } from './options.js'

type TransactGetCommandOptions = Partial<Omit<TransactGetCommandInput, 'TransactItems'>>

export const parseTransactGetOptions = (
  transactGetOptions: TransactGetOptions
): TransactGetCommandOptions => {
  const commandOptions: TransactGetCommandOptions = {}

  const { capacity, ...extraOptions } = transactGetOptions
  rejectExtraOptions(extraOptions)

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  return commandOptions
}
