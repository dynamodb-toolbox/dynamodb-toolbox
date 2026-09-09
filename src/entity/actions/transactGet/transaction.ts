import type { TransactGetCommandInput } from '@aws-sdk/lib-dynamodb'

/** Single item entry of a `TransactGetItems` operation. */
export type TransactGetItem = NonNullable<
  NonNullable<TransactGetCommandInput['TransactItems']>[number]
>
