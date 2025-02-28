import type { AttrSchema, Extension, ItemSchema, SchemaBasicValue } from '~/attributes/index.js'

import type { TransformedValue } from './transformedValue.js'
import type { ValidValue } from './validValue.js'

export const $extension = Symbol('$extension')
export type $extension = typeof $extension

export const $contextExtension = Symbol('$contextExtension')
export type $contextExtension = typeof $contextExtension

export type ExtensionParserOptions = { transform?: boolean; valuePath?: (string | number)[] }

export type ExtensionParser<
  EXTENSION extends Extension = Extension,
  CONTEXT_EXTENSION extends Extension = EXTENSION
> = { [$extension]?: EXTENSION; [$contextExtension]?: CONTEXT_EXTENSION } & ((
  schema: AttrSchema,
  input: unknown,
  options?: ExtensionParserOptions
) =>
  | {
      isExtension: true
      extensionParser: () => Generator<
        ValidValue<AttrSchema, { extension: EXTENSION }>,
        TransformedValue<AttrSchema, { extension: EXTENSION }>,
        ValidValue<ItemSchema, { extension: CONTEXT_EXTENSION }> | undefined
      >
      basicInput?: never
    }
  | {
      isExtension: false
      extensionParser?: never
      basicInput: SchemaBasicValue<EXTENSION> | undefined
    })
