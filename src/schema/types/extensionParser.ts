import type { AttrSchema, AttributeBasicValue, Extension } from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'

import type { TransformedValue } from './transformedValue.js'
import type { ValidValue } from './validValue.js'

export const $extension = Symbol('$extension')
export type $extension = typeof $extension

export const $contextExtension = Symbol('$contextExtension')
export type $contextExtension = typeof $contextExtension

export type ExtensionParserOptions = { transform?: boolean }

export type ExtensionParser<
  EXTENSION extends Extension = Extension,
  CONTEXT_EXTENSION extends Extension = EXTENSION
> = { [$extension]?: EXTENSION; [$contextExtension]?: CONTEXT_EXTENSION } & ((
  attribute: AttrSchema,
  input: unknown,
  options?: ExtensionParserOptions
) =>
  | {
      isExtension: true
      extensionParser: () => Generator<
        ValidValue<AttrSchema, { extension: EXTENSION }>,
        TransformedValue<AttrSchema, { extension: EXTENSION }>,
        ValidValue<Schema, { extension: CONTEXT_EXTENSION }> | undefined
      >
      basicInput?: never
    }
  | {
      isExtension: false
      extensionParser?: never
      basicInput: AttributeBasicValue<EXTENSION> | undefined
    })
