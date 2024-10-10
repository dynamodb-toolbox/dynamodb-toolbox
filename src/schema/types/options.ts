import type { Attribute, ExtendedValue, Extension } from '~/attributes/index.js'

export type WriteMode = 'key' | 'put' | 'update'

export interface WriteValueOptions {
  mode?: WriteMode
  extension?: Extension
  defined?: boolean
}

export type AttrExtendedWriteValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends WriteValueOptions = {}
> = OPTIONS extends { extension: Extension }
  ? ExtendedValue<OPTIONS['extension'], ATTRIBUTE['type']>
  : never
