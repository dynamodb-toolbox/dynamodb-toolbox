export const $entities = Symbol('$entities')
/** Symbol key for the entities a `Table` or `TableAction` spans. */
export type $entities = typeof $entities

export const $interceptor = Symbol('$interceptor')
/** Symbol key for a `Table`'s action interceptor (used by `spy`). */
export type $interceptor = typeof $interceptor

export const $sentArgs = Symbol('$sentArgs')
/** Symbol key for the arguments a sendable action sends to DynamoDB. */
export type $sentArgs = typeof $sentArgs
