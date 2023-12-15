import { DynamoDBDocumentClient, TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import { EntityV2 } from 'v1/entity'
import { EntityOperation } from '../class'

type WriteTransaction = NonNullable<TransactWriteCommandInput['TransactItems']>[number]

export type WriteTransactionItemType = keyof WriteTransaction

export interface WriteItemTransaction<
  ENTITY extends EntityV2 = EntityV2,
  TRANSACTION_ITEM_TYPE extends WriteTransactionItemType = WriteTransactionItemType
> extends EntityOperation<ENTITY> {
  get: () => {
    documentClient: DynamoDBDocumentClient
    type: TRANSACTION_ITEM_TYPE
    params: WriteTransaction[TRANSACTION_ITEM_TYPE]
  }
}
