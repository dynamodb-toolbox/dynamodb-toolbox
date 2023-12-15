import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
  TransactWriteCommandOutput
} from '@aws-sdk/lib-dynamodb'
import { WriteItemTransaction } from 'v1/operations/transactions/types'
import { DynamoDBToolboxError } from 'v1/errors'

export const generateTransactWriteCommandInput = (commands: WriteItemTransaction[]) => {
  return {
    // TODO: handle options
    TransactItems: commands
      .map(command => command.get())
      .map(({ params, type }) => ({
        [type]: params
      }))
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
  options: { dynamoDBDocumentClient?: DynamoDBDocumentClient }
): Promise<TransactWriteCommandOutput> => {
  const dynamoDBDocumentClient =
    options.dynamoDBDocumentClient || transactions?.[0]?.get()?.documentClient

  if (!dynamoDBDocumentClient) {
    throw new DynamoDBToolboxError('operations.incompleteCommand', {
      message: 'DynamoDBDocumentClient not found'
    })
  }

  const response = await dynamoDBDocumentClient.send(
    new TransactWriteCommand(generateTransactWriteCommandInput(transactions))
  )

  return response
}
