import type { Attribute, AttributeBasicValue, Extension } from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'

import type { $contextExtension, $extension } from '../constants.js'
import type { ParsedValue } from '../parser.js'

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
        ParsedValue<Attribute, { extension: EXTENSION }>,
        ParsedValue<Attribute, { extension: EXTENSION }>,
        ParsedValue<Schema, { extension: CONTEXT_EXTENSION }> | undefined
      >
      basicInput?: never
    }
  | {
      isExtension: false
      extensionParser?: never
      basicInput: AttributeBasicValue<EXTENSION> | undefined
    })
