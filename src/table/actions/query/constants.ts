export const $query = Symbol('$query')
/** Symbol key for a query command's query input. */
export type $query = typeof $query

export const $options = Symbol('$options')
/** Symbol key for a table command's options. */
export type $options = typeof $options

export const $entity = Symbol('$entity')
/** Symbol tagging a formatted item with its entity name (used by `DeletePartitionCommand`). */
export type $entity = typeof $entity
