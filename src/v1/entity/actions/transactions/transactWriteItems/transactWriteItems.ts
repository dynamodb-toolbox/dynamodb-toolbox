import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
  TransactWriteCommandOutput
} from '@aws-sdk/lib-dynamodb'
import type { TransactWriteItemsInput } from '@aws-sdk/client-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'

import type { WriteItemTransaction } from '../types'
import type { TransactWriteOptions } from './options'
import { parseTransactWriteOptions } from './parseTransactWriteOptions'

export const getTransactWriteCommandInput = (
  commands: WriteItemTransaction[],
  transactWriteOptions: TransactWriteOptions = {}
): TransactWriteItemsInput => {
  const options = parseTransactWriteOptions(transactWriteOptions ?? {})

  return {
    ...options,
    TransactItems: commands
      .map(command => command.get())
      .map(({ params, type }) => ({ [type]: params }))
  }
}

/** Run a `TransactWriteItems` operation
 *
 * @param transactions
 * @param options
 */
export const transactWriteItems = async <TRANSACTIONS extends WriteItemTransaction[]>(
  /** Array of Write Item transactions */
  transactions: TRANSACTIONS,
  options?: {
    /** Optional DynamoDB client. If not provided, the client linked to the first transaction is used. */
    dynamoDBDocumentClient?: DynamoDBDocumentClient
    /** Options passed to top-level  TransactWriteItems */
    transactWriteOptions?: TransactWriteOptions
  }
): Promise<TransactWriteCommandOutput> => {
  const dynamoDBDocumentClient =
    options?.dynamoDBDocumentClient || transactions?.[0]?.get()?.documentClient

  if (!dynamoDBDocumentClient) {
    throw new DynamoDBToolboxError('actions.incompleteAction', {
      message: 'DynamoDBDocumentClient not found'
    })
  }

  const response = await dynamoDBDocumentClient.send(
    new TransactWriteCommand(
      getTransactWriteCommandInput(transactions, options?.transactWriteOptions ?? {})
    )
  )

  return response
}
