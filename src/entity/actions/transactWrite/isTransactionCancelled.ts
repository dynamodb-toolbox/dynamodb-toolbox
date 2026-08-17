import type { CancellationReason, TransactionCanceledException } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { FormattedItem } from '~/entity/index.js'

import type { WriteTransactionImplementation } from './transaction.js'

type TransactionCancelledReason<TRANSACTION extends WriteTransactionImplementation> =
  CancellationReason & { FormattedItem?: FormattedItem<TRANSACTION['entity']> }

type TransactionCancelledReasonRec<
  TRANSACTIONS extends WriteTransactionImplementation[],
  REASONS extends unknown[] = []
> = TRANSACTIONS extends [infer TRANSACTIONS_HEAD, ...infer TRANSACTIONS_TAIL]
  ? TRANSACTIONS_HEAD extends WriteTransactionImplementation
    ? TRANSACTIONS_TAIL extends WriteTransactionImplementation[]
      ? TransactionCancelledReasonRec<
          TRANSACTIONS_TAIL,
          [...REASONS, TransactionCancelledReason<TRANSACTIONS_HEAD>]
        >
      : never
    : never
  : number extends TRANSACTIONS['length']
    ? [
        ...REASONS,
        ...(TRANSACTIONS[number] extends infer TRANSACTION
          ? TRANSACTION extends WriteTransactionImplementation
            ? TransactionCancelledReason<TRANSACTION>
            : never
          : never)[]
      ]
    : REASONS extends []
      ? CancellationReason[]
      : REASONS

export type TransactionCancelledError<
  TRANSACTIONS extends WriteTransactionImplementation[] = WriteTransactionImplementation[]
> = Omit<TransactionCanceledException, 'CancellationReasons'> & {
  CancellationReasons?: TransactionCancelledReasonRec<TRANSACTIONS>
}

export type IsTransactionCancelled = <TRANSACTIONS extends WriteTransactionImplementation[]>(
  error: unknown,
  ...transactions: TRANSACTIONS
) => error is TransactionCancelledError<TRANSACTIONS>

export const isTransactionCancelled: IsTransactionCancelled = <
  TRANSACTIONS extends WriteTransactionImplementation[]
>(
  error: unknown,
  ...transactions: TRANSACTIONS
): error is TransactionCancelledError<TRANSACTIONS> => {
  if (
    typeof error !== 'object' ||
    error === null ||
    (error as { name?: unknown }).name !== 'TransactionCanceledException'
  ) {
    return false
  }

  const transactionCancelledError = error as TransactionCancelledError<TRANSACTIONS>

  transactionCancelledError.CancellationReasons?.forEach((transactionCancelledReason, index) => {
    if (
      transactionCancelledReason.FormattedItem === undefined &&
      transactionCancelledReason.Item !== undefined &&
      transactions[index] !== undefined
    ) {
      try {
        transactionCancelledReason.FormattedItem = transactions[index]?.entity
          .build(EntityFormatter)
          .format(unmarshall(transactionCancelledReason.Item))
        // eslint-disable-next-line no-empty
      } catch {}
    }
  })

  return true
}
