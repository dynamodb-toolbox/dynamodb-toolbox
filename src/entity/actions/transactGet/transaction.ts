import type { TransactGetCommandInput } from '@aws-sdk/lib-dynamodb'

export type TransactGetItem = NonNullable<
  NonNullable<TransactGetCommandInput['TransactItems']>[number]
>
