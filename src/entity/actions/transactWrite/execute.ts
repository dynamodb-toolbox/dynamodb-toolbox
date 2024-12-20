import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import type {
  DynamoDBDocumentClient,
  TransactWriteCommandInput,
  TransactWriteCommandOutput
} from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import type { CapacityOption } from '~/options/capacity.js'
import { parseClientRequestToken } from '~/options/clientRequestToken.js'
import type { ClientRequestToken } from '~/options/clientRequestToken.js'
import { parseMetricsOption } from '~/options/metrics.js'
import type { MetricsOption } from '~/options/metrics.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'

import type { WriteTransactionImplementation } from './transaction.js'
import { isWriteTransactionImplementation } from './transaction.js'

export interface ExecuteTransactWriteOptions extends DocumentClientOptions {
  documentClient?: DynamoDBDocumentClient
  capacity?: CapacityOption
  metrics?: MetricsOption
  clientRequestToken?: ClientRequestToken
}

export type ExecuteTransactWriteInput =
  | WriteTransactionImplementation[]
  | [ExecuteTransactWriteOptions, ...WriteTransactionImplementation[]]

type ExecuteTransactWrite = <TRANSACTIONS extends ExecuteTransactWriteInput>(
  ...transactions: TRANSACTIONS
) => Promise<ExecuteTransactWriteResponses<TRANSACTIONS>>

export type ExecuteTransactWriteResponses<TRANSACTIONS extends ExecuteTransactWriteInput> =
  TRANSACTIONS extends WriteTransactionImplementation[]
    ? ExecuteTransactWriteResponse<TRANSACTIONS>
    : TRANSACTIONS extends [ExecuteTransactWriteOptions, ...infer TRANSACTIONS_TAIL]
      ? TRANSACTIONS_TAIL extends WriteTransactionImplementation[]
        ? ExecuteTransactWriteResponse<TRANSACTIONS_TAIL>
        : never
      : never

type ExecuteTransactWriteResponse<TRANSACTIONS extends WriteTransactionImplementation[]> =
  TransactWriteCommandOutput & { ToolboxItems: ToolboxItems<TRANSACTIONS> }

type ToolboxItems<
  TRANSACTIONS extends WriteTransactionImplementation[],
  TOOLBOX_ITEMS extends unknown[] = []
> = TRANSACTIONS extends [infer TRANSACTIONS_HEAD, ...infer TRANSACTIONS_TAIL]
  ? TRANSACTIONS_HEAD extends WriteTransactionImplementation
    ? TRANSACTIONS_TAIL extends WriteTransactionImplementation[]
      ? ToolboxItems<TRANSACTIONS_TAIL, [...TOOLBOX_ITEMS, ToolboxItem<TRANSACTIONS_HEAD>]>
      : never
    : never
  : number extends TRANSACTIONS['length']
    ? [
        ...TOOLBOX_ITEMS,
        ...(TRANSACTIONS[number] extends infer TRANSACTION
          ? TRANSACTION extends WriteTransactionImplementation
            ? ToolboxItem<TRANSACTION>
            : never
          : never)[]
      ]
    : TOOLBOX_ITEMS extends []
      ? unknown[]
      : TOOLBOX_ITEMS

type ToolboxItem<
  TRANSACTION extends WriteTransactionImplementation,
  PARAMS = ReturnType<TRANSACTION['params']>
> = PARAMS extends { ToolboxItem: unknown } ? PARAMS['ToolboxItem'] : undefined

export const execute: ExecuteTransactWrite = async <
  TRANSACTIONS extends
    | WriteTransactionImplementation[]
    | [ExecuteTransactWriteOptions, ...WriteTransactionImplementation[]]
>(
  ..._transactions: TRANSACTIONS
) => {
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

  const { documentClient, capacity, metrics, clientRequestToken, ...documentClientOptions } =
    options
  const docClient = documentClient ?? firstTransaction.entity.table.getDocumentClient()

  const { TransactItems = [], ...restCommandInput } = getCommandInput(transactions, {
    capacity,
    metrics,
    clientRequestToken
  })

  const toolboxItems: unknown[] = []

  for (const transactItem of TransactItems) {
    const { ToolboxItem } = transactItem
    toolboxItems.push(ToolboxItem)
    delete transactItem.ToolboxItem
  }

  const response = await docClient.send(
    new TransactWriteCommand({ TransactItems, ...restCommandInput }),
    documentClientOptions
  )

  return { ToolboxItems: toolboxItems, ...response } as ExecuteTransactWriteResponses<TRANSACTIONS>
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
): TransactWriteCommandInput & { TransactItems: { ToolboxItem?: unknown }[] } => ({
  ...parseOptions(options),
  TransactItems: transactions.map(command => command.params())
})
