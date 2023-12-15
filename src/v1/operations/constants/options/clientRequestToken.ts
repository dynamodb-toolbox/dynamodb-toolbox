export type ClientRequestToken = string

export interface ClientRequestTokenOptions {
  /** Makes the call to TransactWriteItems idempotent, meaning that multiple identical calls have the same effect as one single call. */
  clientRequestToken?: ClientRequestToken
}
