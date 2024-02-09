import { GetItemTransactionInterface } from '../types'
import { TransactGetOptions } from './options'
import { parseTransactGetOptions } from './parseTransactGetOptions'
import { TransactGetItemsInput } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  TransactGetCommand,
  TransactGetCommandOutput
} from '@aws-sdk/lib-dynamodb'
import { DynamoDBToolboxError } from 'v1/errors'

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

/** Run a `TransactGetItems` operation
 *
 * @param transactions
 * @param options
 */
export const transactGetItems = async <TRANSACTIONS extends GetItemTransactionInterface[]>(
  /** Array of Get Item transactions */
  transactions: TRANSACTIONS,
  options?: {
    /** Optional DynamoDB client. If not provided, the client linked to the first transaction is used. */
    dynamoDBDocumentClient?: DynamoDBDocumentClient
    /** Options passed to top-level  TransactGetItems */
    transactGetOptions?: TransactGetOptions
  }
): Promise<TransactGetCommandOutput> => {
  const dynamoDBDocumentClient =
    options?.dynamoDBDocumentClient || transactions?.[0]?.get()?.documentClient

  if (!dynamoDBDocumentClient) {
    throw new DynamoDBToolboxError('operations.incompleteOperation', {
      message: 'DynamoDBDocumentClient not found'
    })
  }

  const response = await dynamoDBDocumentClient.send(
    new TransactGetCommand(
      getTransactGetCommandInput(transactions, options?.transactGetOptions ?? {})
    )
  )

  return response
}
