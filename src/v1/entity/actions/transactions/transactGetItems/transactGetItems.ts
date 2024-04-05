import type { TransactGetItemsInput } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  TransactGetCommand,
  TransactGetCommandOutput
} from '@aws-sdk/lib-dynamodb'

import { EntityV2, $entity } from 'v1/entity'
import { EntityFormatter, FormattedItem } from 'v1/entity/actions/format'
import type { EntityPaths } from 'v1/entity/actions/parsePaths'

import { DynamoDBToolboxError } from 'v1/errors'

import type { GetItemTransactionOptions } from '../transactGetItem/options'
import { $options, GetItemTransactionInterface } from '../transactGetItem/transactGetItem'
import type { TransactGetOptions } from './options'
import { parseTransactGetOptions } from './parseTransactGetOptions'

export const getTransactGetCommandInput = (
  operations: GetItemTransactionInterface[],
  transactGetOptions: TransactGetOptions = {}
): TransactGetItemsInput => {
  const options = parseTransactGetOptions(transactGetOptions ?? {})

  return {
    ...options,
    TransactItems: operations
      .map(command => command.get())
      .map(({ params, type }) => ({
        [type]: params
      }))
  }
}

type ReturnedItem<
  ENTITY extends EntityV2,
  OPTIONS extends GetItemTransactionOptions<ENTITY> = {}
> = EntityV2 extends ENTITY
  ? Record<string, unknown>
  : OPTIONS['attributes'] extends EntityPaths<ENTITY>[]
  ? FormattedItem<
      ENTITY,
      {
        attributes: OPTIONS['attributes'] extends EntityPaths<ENTITY>[]
          ? OPTIONS['attributes'][number]
          : undefined
      }
    >
  : FormattedItem<ENTITY>

type ReturnedItemFromTransaction<TRANSACTION extends GetItemTransactionInterface> =
  // Trick with TypeScript to make the return item types work correctly
  // @ts-expect-error -- Type 'TRANSACTION[$options]' does not satisfy the constraint 'GetItemTransactionOptions<TRANSACTION[$options]>'.
  ReturnedItem<TRANSACTION[$entity], TRANSACTION[$options]> | undefined

type ReturnedItemsRec<
  TRANSACTIONS extends GetItemTransactionInterface[],
  RESULTS extends ReturnedItemFromTransaction<GetItemTransactionInterface>[] = []
> = TRANSACTIONS extends [infer TRANSACTIONS_HEAD, ...infer TRANSACTIONS_TAIL]
  ? TRANSACTIONS_HEAD extends GetItemTransactionInterface
    ? TRANSACTIONS_TAIL extends GetItemTransactionInterface[]
      ? ReturnedItemsRec<
          TRANSACTIONS_TAIL,
          [...RESULTS, ReturnedItemFromTransaction<TRANSACTIONS_HEAD>]
        >
      : never
    : never
  : RESULTS extends []
  ? (FormattedItem | undefined)[]
  : RESULTS

type ReturnedItems<
  TRANSACTIONS extends GetItemTransactionInterface[]
> = ReturnedItemsRec<TRANSACTIONS>

export const formatTransactGetResponse = <TRANSACTIONS extends GetItemTransactionInterface[]>(
  response: TransactGetCommandOutput,
  ...transactions: TRANSACTIONS
): ReturnedItems<TRANSACTIONS> | undefined => {
  if (response.Responses === undefined) {
    return undefined
  }

  if (response.Responses.length !== transactions.length) {
    throw new DynamoDBToolboxError('actions.inconsistentNumberOfItems', {
      message: 'Response length does not match the number of transactions',
      payload: {
        expected: transactions.length,
        received: response.Responses.length
      }
    })
  }

  const formattedResponses = response.Responses.map((response, index) =>
    response.Item
      ? new EntityFormatter(transactions[index][$entity]).format(
          response.Item,
          transactions[index][$options].attributes
            ? { attributes: transactions[index][$options].attributes }
            : {}
        )
      : undefined
  )

  return formattedResponses as ReturnedItems<TRANSACTIONS>
}

/** Run a `TransactGetItems` operation
 *
 * @param options Object { dynamoDBDocumentClient: Optional DynamoDBDocumentClient, transactGetOptions: Optional TransactGetOptions }
 * @param transactions Destructured array of Get Item transactions
 */
export const transactGetItems = async <TRANSACTIONS extends GetItemTransactionInterface[]>(
  options: {
    /** Optional DynamoDB client. If not provided, the client linked to the first transaction is used. */
    dynamoDBDocumentClient?: DynamoDBDocumentClient
    /** Options passed to top-level TransactGetItems */
    transactGetOptions?: TransactGetOptions
  },
  /** Array of Get Item transactions */
  ...transactions: TRANSACTIONS
): Promise<
  Omit<TransactGetCommandOutput, 'Responses'> & {
    Responses: ReturnedItems<TRANSACTIONS> | undefined
  }
> => {
  const dynamoDBDocumentClient =
    options?.dynamoDBDocumentClient || transactions?.[0]?.get()?.documentClient

  if (!dynamoDBDocumentClient) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'DynamoDBDocumentClient not found'
    })
  }

  const response = await dynamoDBDocumentClient.send(
    new TransactGetCommand(
      getTransactGetCommandInput(transactions, options?.transactGetOptions ?? {})
    )
  )

  const formattedResponses = formatTransactGetResponse<TRANSACTIONS>(response, ...transactions)

  return {
    ...response,
    Responses: formattedResponses
  }
}
