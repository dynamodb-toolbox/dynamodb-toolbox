import { isTransactionCancelled } from './isTransactionCancelled.js'
import type { TransactionCancelledError } from './isTransactionCancelled.js'
import type { WriteTransactionImplementation } from './transaction.js'

/** Signature of `assertTransactionCancelled`. */
export type AssertTransactionCancelled = <TRANSACTIONS extends WriteTransactionImplementation[]>(
  error: unknown,
  ...transactions: TRANSACTIONS
) => asserts error is TransactionCancelledError<TRANSACTIONS>

/**
 * Assert that an error is a cancelled transaction, re-throwing it otherwise.
 */
export const assertTransactionCancelled: AssertTransactionCancelled = (error, ...transactions) => {
  if (!isTransactionCancelled(error, ...transactions)) {
    throw error
  }
}
