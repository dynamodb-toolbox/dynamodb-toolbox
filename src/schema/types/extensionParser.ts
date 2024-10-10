import type { Attribute, AttributeBasicValue, Extension } from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'

import type { FullValue } from './fullValue.js'
import type { TransformedValue } from './transformedValue.js'

export const $extension = Symbol('$extension')
export type $extension = typeof $extension

export const $contextExtension = Symbol('$contextExtension')
export type $contextExtension = typeof $contextExtension

export type ExtensionParserOptions = { transform?: boolean }

export type ExtensionParser<
  EXTENSION extends Extension = Extension,
  CONTEXT_EXTENSION extends Extension = EXTENSION
> = { [$extension]?: EXTENSION; [$contextExtension]?: CONTEXT_EXTENSION } & ((
  attribute: Attribute,
  input: unknown,
  options?: ExtensionParserOptions
) =>
  | {
      isExtension: true
      extensionParser: () => Generator<
        FullValue<Attribute, { extension: EXTENSION }>,
        TransformedValue<Attribute, { extension: EXTENSION }>,
        FullValue<Schema, { extension: CONTEXT_EXTENSION }> | undefined
      >
      basicInput?: never
    }
  | {
      isExtension: false
      extensionParser?: never
      basicInput: AttributeBasicValue<EXTENSION> | undefined
    })
