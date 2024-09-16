import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'

export type TransactWriteItem = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]
> & { ToolboxItem?: unknown }

export class WriteTransaction<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {}

export interface WriteTransactionImplementation<ENTITY extends Entity = Entity>
  extends EntityAction<ENTITY> {
  params: () => TransactWriteItem & { ToolboxItem?: unknown }
}

type IsWriteTransactionImplementation = (input: unknown) => input is WriteTransactionImplementation

export const isWriteTransactionImplementation: IsWriteTransactionImplementation = (
  input
): input is WriteTransactionImplementation => input instanceof WriteTransaction
