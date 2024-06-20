import type { TransactGetCommandInput } from '@aws-sdk/lib-dynamodb'

import { parseCapacityOption } from '~/options/capacity.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

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
