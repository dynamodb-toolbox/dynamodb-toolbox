import { EntityOperation } from '../class'
import {
  DynamoDBDocumentClient,
  TransactGetCommandInput,
  TransactWriteCommandInput
} from '@aws-sdk/lib-dynamodb'
import { EntityV2 } from 'v1/entity'

type GetTransaction = NonNullable<TransactGetCommandInput['TransactItems']>[number]

export type GetTransactionParams = GetTransaction['Get']

export type GetTransactionItemType = keyof GetTransaction

type WriteTransaction = NonNullable<TransactWriteCommandInput['TransactItems']>[number]

export type WriteTransactionItemType = keyof WriteTransaction

export interface BaseTransaction {
  get: () => {
    documentClient: DynamoDBDocumentClient
    type: GetTransactionItemType | WriteTransactionItemType
    params: Record<string, unknown> | undefined
  }
}

export interface GetItemTransactionInterface<ENTITY extends EntityV2 = EntityV2>
  extends BaseTransaction,
    EntityOperation<ENTITY> {
  get: () => {
    documentClient: DynamoDBDocumentClient
    type: 'Get'
    params: GetTransactionParams
  }
}

export interface WriteItemTransaction<
  ENTITY extends EntityV2 = EntityV2,
  TRANSACTION_ITEM_TYPE extends WriteTransactionItemType = WriteTransactionItemType
> extends BaseTransaction,
    EntityOperation<ENTITY> {
  get: () => {
    documentClient: DynamoDBDocumentClient
    type: TRANSACTION_ITEM_TYPE
    params: WriteTransaction[TRANSACTION_ITEM_TYPE]
  }
}
