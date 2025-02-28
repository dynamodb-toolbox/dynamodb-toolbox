import type { AttrSchema, ExtendedValue, Extension } from '~/attributes/index.js'
import type { Paths } from '~/schema/index.js'

export type WriteMode = 'key' | 'put' | 'update'

export interface WriteValueOptions {
  mode?: WriteMode
  extension?: Extension
  defined?: boolean
}

export type AttrExtendedWriteValue<
  ATTRIBUTE extends AttrSchema,
  OPTIONS extends WriteValueOptions = {}
> = OPTIONS extends { extension: Extension }
  ? ExtendedValue<OPTIONS['extension'], ATTRIBUTE['type']>
  : never

export type ReadValueOptions<SCHEMA extends AttrSchema> = {
  attributes?: Paths<SCHEMA>
  partial?: boolean
}
