import { isTransactionCancelled } from './isTransactionCancelled.js'
import type { TransactionCancelledError } from './isTransactionCancelled.js'
import type { WriteTransactionImplementation } from './transaction.js'

export type AssertTransactionCancelled = <TRANSACTIONS extends WriteTransactionImplementation[]>(
  error: unknown,
  ...transactions: TRANSACTIONS
) => asserts error is TransactionCancelledError<TRANSACTIONS>

export const assertTransactionCancelled: AssertTransactionCancelled = (error, ...transactions) => {
  if (!isTransactionCancelled(error, ...transactions)) {
    throw error
  }
}
