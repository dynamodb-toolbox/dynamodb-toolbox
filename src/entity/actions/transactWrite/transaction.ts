import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'

export type TransactWriteItem = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]
>

export class WriteTransaction<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {}

export interface WriteTransactionImplementation<ENTITY extends Entity = Entity>
  extends EntityAction<ENTITY> {
  params: () => TransactWriteItem
}

export const isWriteTransactionImplementation = (
  candidate: unknown
): candidate is WriteTransactionImplementation => candidate instanceof WriteTransaction
