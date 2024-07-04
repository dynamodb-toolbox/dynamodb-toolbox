import type { DynamoDBDocumentClient, TransactGetCommandInput } from '@aws-sdk/lib-dynamodb'

type GetTransaction = NonNullable<TransactGetCommandInput['TransactItems']>[number]

export type GetTransactionParams = GetTransaction['Get']

export type GetTransactionItemType = keyof GetTransaction

export interface BaseTransaction {
  get: () => {
    documentClient: DynamoDBDocumentClient
    type: GetTransactionItemType
    params: Record<string, unknown> | undefined
  }
}
