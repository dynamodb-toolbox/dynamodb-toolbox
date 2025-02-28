import type { ExtendedValue, Extension, Schema } from '~/attributes/index.js'
import type { Paths } from '~/schema/index.js'

export type WriteMode = 'key' | 'put' | 'update'

export interface WriteValueOptions {
  mode?: WriteMode
  extension?: Extension
  defined?: boolean
}

export type SchemaExtendedWriteValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions = {}
> = OPTIONS extends { extension: Extension }
  ? ExtendedValue<OPTIONS['extension'], SCHEMA['type']>
  : never

export type ReadValueOptions<SCHEMA extends Schema> = {
  attributes?: Paths<SCHEMA>
  partial?: boolean
}
