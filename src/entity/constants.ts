export const $interceptor = Symbol('$interceptor')
/** Symbol key for an `Entity`'s action interceptor (used by `spy`). */
export type $interceptor = typeof $interceptor

export const $sentArgs = Symbol('$sentArgs')
/** Symbol key for the arguments a sendable action sends to DynamoDB. */
export type $sentArgs = typeof $sentArgs
