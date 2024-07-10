import { TransactGetCommand } from '@aws-sdk/lib-dynamodb'
import type {
  DynamoDBDocumentClient,
  TransactGetCommandInput,
  TransactGetCommandOutput
} from '@aws-sdk/lib-dynamodb'

import type { FormattedItem } from '~/entity/actions/format/index.js'
import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { EntityPaths } from '~/entity/actions/parsePaths/index.js'
import { $entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { CapacityOption } from '~/options/capacity.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import { $options } from './getTransaction/constants.js'
import { GetTransaction } from './getTransaction/getTransaction.js'

type GetTransactionProps = Pick<GetTransaction, $entity | $options | 'params'>

export interface ExecuteTransactGetOptions {
  documentClient?: DynamoDBDocumentClient
  capacity?: CapacityOption
}

type ExecuteTransactGet = <
  TRANSACTIONS extends GetTransactionProps[] | [ExecuteTransactGetOptions, ...GetTransactionProps[]]
>(
  ..._transactions: TRANSACTIONS
) => Promise<
  TRANSACTIONS extends GetTransactionProps[]
    ? ExecuteTansactGetResponse<TRANSACTIONS>
    : TRANSACTIONS extends [unknown, ...infer TRANSACTIONS_TAIL]
      ? TRANSACTIONS_TAIL extends GetTransactionProps[]
        ? ExecuteTansactGetResponse<TRANSACTIONS_TAIL>
        : never
      : never
>

type ExecuteTansactGetResponse<TRANSACTIONS extends GetTransactionProps[]> = Omit<
  TransactGetCommandOutput,
  'Responses'
> & { Responses?: TansactGetResponses<TRANSACTIONS> }

type TansactGetResponses<
  TRANSACTIONS extends GetTransactionProps[],
  RESPONSES extends unknown[] = []
> = number extends TRANSACTIONS['length']
  ? (TRANSACTIONS[number] extends infer TRANSACTION
      ? TRANSACTION extends GetTransactionProps
        ? TansactGetResponse<TRANSACTION>
        : never
      : never)[]
  : TRANSACTIONS extends [infer TRANSACTIONS_HEAD, ...infer TRANSACTIONS_TAIL]
    ? TRANSACTIONS_HEAD extends GetTransactionProps
      ? TRANSACTIONS_TAIL extends GetTransactionProps[]
        ? TansactGetResponses<
            TRANSACTIONS_TAIL,
            [...RESPONSES, TansactGetResponse<TRANSACTIONS_HEAD>]
          >
        : never
      : never
    : RESPONSES extends []
      ? (FormattedItem | undefined)[]
      : RESPONSES

type TansactGetResponse<TRANSACTION extends GetTransactionProps> = {
  Item?: TRANSACTION[$options]['attributes'] extends EntityPaths<TRANSACTION[$entity]>[]
    ? FormattedItem<
        TRANSACTION[$entity],
        { attributes: TRANSACTION[$options]['attributes'][number] }
      >
    : FormattedItem<TRANSACTION[$entity]>
}

type TransactGetResponseFormatter = <TRANSACTIONS extends GetTransactionProps[]>(
  responses: NonNullable<TransactGetCommandOutput['Responses']>,
  ...transactions: TRANSACTIONS
) => TansactGetResponses<TRANSACTIONS> | undefined

export const formatResponses: TransactGetResponseFormatter = <
  TRANSACTIONS extends GetTransactionProps[]
>(
  responses: NonNullable<TransactGetCommandOutput['Responses']>,
  ...transactions: TRANSACTIONS
) =>
  responses.map(({ Item: item }, index) => {
    const transaction = transactions[index]
    const transactionEntity = transaction[$entity]
    const { attributes } = transaction[$options]

    return {
      Item: item
        ? new EntityFormatter(transactionEntity).format(item, attributes ? { attributes } : {})
        : undefined
    }
  }) as TansactGetResponses<TRANSACTIONS>

export const execute: ExecuteTransactGet = async <
  TRANSACTIONS extends GetTransactionProps[] | [ExecuteTransactGetOptions, ...GetTransactionProps[]]
>(
  ..._transactions: TRANSACTIONS
) => {
  type RESPONSE = TRANSACTIONS extends GetTransactionProps[]
    ? ExecuteTansactGetResponse<TRANSACTIONS>
    : TRANSACTIONS extends [unknown, ...infer TRANSACTIONS_TAIL]
      ? TRANSACTIONS_TAIL extends GetTransactionProps[]
        ? ExecuteTansactGetResponse<TRANSACTIONS_TAIL>
        : never
      : never

  const [headTransactionOrOptions = {}, ...tailTransactions] = _transactions

  const transactions = tailTransactions as GetTransactionProps[]
  let options: ExecuteTransactGetOptions = {}

  if (headTransactionOrOptions instanceof GetTransaction) {
    transactions.unshift(headTransactionOrOptions)
  } else {
    options = headTransactionOrOptions as ExecuteTransactGetOptions
  }

  const firstTransaction = transactions[0]
  if (firstTransaction === undefined) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'transactGet incomplete: No GetTransaction supplied'
    })
  }

  const { documentClient: optionsDocumentClient, ...restOptions } = options
  const documentClient =
    optionsDocumentClient ?? firstTransaction[$entity].table.getDocumentClient()

  const { Responses, ...restResponse } = await documentClient.send(
    new TransactGetCommand(getCommandInput(transactions, restOptions))
  )

  if (Responses === undefined) {
    return restResponse as RESPONSE
  }

  return {
    ...restResponse,
    Responses: formatResponses(Responses, ...transactions)
  } as RESPONSE
}

export const getCommandInput = (
  transactions: GetTransactionProps[],
  options: ExecuteTransactGetOptions = {}
): TransactGetCommandInput => {
  const { capacity, ...extraOptions } = options
  rejectExtraOptions(extraOptions)

  return {
    TransactItems: transactions.map(command => command.params()),
    ...(capacity !== undefined ? { ReturnConsumedCapacity: parseCapacityOption(capacity) } : {})
  }
}
