import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'

/** Single item entry of a `TransactWriteItems` operation. */
export type TransactWriteItem = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]
> & { ToolboxItem?: unknown }

/** Base class for the write transactions of a `TransactWriteItems` operation. */
export class WriteTransaction<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {}

/** A `WriteTransaction` that can build its own `TransactWriteItems` entry. */
export interface WriteTransactionImplementation<ENTITY extends Entity = Entity>
  extends EntityAction<ENTITY> {
  params: () => TransactWriteItem & { ToolboxItem?: unknown }
}

type IsWriteTransactionImplementation = (input: unknown) => input is WriteTransactionImplementation

/** Tell whether a value is a write transaction. */
export const isWriteTransactionImplementation: IsWriteTransactionImplementation = (
  input
): input is WriteTransactionImplementation => input instanceof WriteTransaction
