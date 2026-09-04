import type { ArrayPath } from '~/schema/actions/utils/types.js'
import type { Extension, ItemSchema, Schema, SchemaUnextendedValue } from '~/schema/index.js'

import type { TransformedValue } from './transformedValue.js'
import type { ValidValue } from './validValue.js'

export const $extension = Symbol('$extension')
/** Key branding an extension parser with its extension type. */
export type $extension = typeof $extension

export const $contextExtension = Symbol('$contextExtension')
/** Key branding an extension parser with its context extension type. */
export type $contextExtension = typeof $contextExtension

/**
 * Options accepted by an extension parser.
 */
export type ExtensionParserOptions = { transform?: boolean; valuePath?: ArrayPath }

/**
 * Function that parses extension values within a schema.
 */
export type ExtensionParser<
  EXTENSION extends Extension = Extension,
  CONTEXT_EXTENSION extends Extension = EXTENSION
> = { [$extension]?: EXTENSION; [$contextExtension]?: CONTEXT_EXTENSION } & ((
  schema: Schema,
  input: unknown,
  options?: ExtensionParserOptions
) =>
  | {
      isExtension: true
      extensionParser: () => Generator<
        ValidValue<Schema, { extension: EXTENSION }>,
        TransformedValue<Schema, { extension: EXTENSION }>,
        ValidValue<ItemSchema, { extension: CONTEXT_EXTENSION }> | undefined
      >
      unextendedInput?: never
    }
  | {
      isExtension: false
      extensionParser?: never
      unextendedInput: SchemaUnextendedValue<EXTENSION> | undefined
    })
