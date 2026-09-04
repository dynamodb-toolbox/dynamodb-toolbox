import type { ExtendedValue, Extension, Paths, Schema } from '~/schema/index.js'

/**
 * Write context of a value: `key`, `put` or `update`.
 */
export type WriteMode = 'key' | 'put' | 'update'

/**
 * Options controlling how a value is parsed for writes.
 */
export interface WriteValueOptions {
  mode?: WriteMode
  extension?: Extension
  defined?: boolean
}

/**
 * Extension value allowed when writing a schema.
 */
export type SchemaExtendedWriteValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions = {}
> = OPTIONS extends { extension: Extension }
  ? ExtendedValue<OPTIONS['extension'], SCHEMA['type']>
  : never

/**
 * Options controlling how a value is formatted for reads.
 */
export type ReadValueOptions<SCHEMA extends Schema> = {
  attributes?: Paths<SCHEMA>
  partial?: boolean
}
