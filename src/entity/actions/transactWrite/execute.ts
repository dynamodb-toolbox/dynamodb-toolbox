import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import type {
  DynamoDBDocumentClient,
  TransactWriteCommandInput,
  TransactWriteCommandOutput
} from '@aws-sdk/lib-dynamodb'

import { $entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import type { CapacityOption } from '~/options/capacity.js'
import { parseClientRequestToken } from '~/options/clientRequestToken.js'
import type { ClientRequestToken } from '~/options/clientRequestToken.js'
import { parseMetricsOption } from '~/options/metrics.js'
import type { MetricsOption } from '~/options/metrics.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import type { WriteTransactionImplementation } from './transaction.js'
import { isWriteTransactionImplementation } from './transaction.js'

export interface ExecuteTransactWriteOptions {
  documentClient?: DynamoDBDocumentClient
  capacity?: CapacityOption
  metrics?: MetricsOption
  clientRequestToken?: ClientRequestToken
}

const parseOptions = (
  options: ExecuteTransactWriteOptions
): Omit<TransactWriteCommandInput, 'TransactItems'> => {
  const commandOptions: Omit<TransactWriteCommandInput, 'TransactItems'> = {}

  const { clientRequestToken, capacity, metrics, ...extraOptions } = options
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

export const getCommandInput = (
  transactions: WriteTransactionImplementation[],
  options: ExecuteTransactWriteOptions = {}
): TransactWriteCommandInput => ({
  ...parseOptions(options),
  TransactItems: transactions.map(command => command.params())
})

export const execute = async (
  ..._transactions:
    | [ExecuteTransactWriteOptions, ...WriteTransactionImplementation[]]
    | WriteTransactionImplementation[]
): Promise<TransactWriteCommandOutput> => {
  const [headTransactionOrOptions = {}, ...tailTransactions] = _transactions

  const transactions = tailTransactions as WriteTransactionImplementation[]
  let options: ExecuteTransactWriteOptions = {}

  if (isWriteTransactionImplementation(headTransactionOrOptions)) {
    transactions.unshift(headTransactionOrOptions)
  } else {
    options = headTransactionOrOptions
  }

  const firstTransaction = transactions[0]
  if (firstTransaction === undefined) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'Cannot execute WriteTransactions: No transaction supplied'
    })
  }

  const { documentClient: optionsDocumentClient, ...restOptions } = options
  const documentClient =
    optionsDocumentClient ?? firstTransaction[$entity].table.getDocumentClient()

  return documentClient.send(new TransactWriteCommand(getCommandInput(transactions, restOptions)))
}
