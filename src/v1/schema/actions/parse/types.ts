import type { Schema } from 'v1/schema'
import type { Extension, Attribute, AttributeBasicValue } from 'v1/schema/attributes'

import type { ParsedValue } from './parser'

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

export type ParsingMode = 'key' | 'put' | 'update'

export type ParsingOptions = {
  fill?: boolean
  transform?: boolean
  mode?: ParsingMode
  parseExtension?: ExtensionParser
}

export type ParsingDefaultOptions = {
  fill: true
  transform: true
  mode: 'put'
  parseExtension: undefined
}

export type ParsedValueOptions = {
  fill?: boolean
  transform?: boolean
  mode?: ParsingMode
  extension?: Extension
}

export type ParsedValueDefaultOptions = {
  fill: true
  transform: true
  mode: 'put'
  extension: undefined
}

export type FromParsingOptions<OPTIONS extends ParsingOptions, CONTEXT extends boolean = false> = {
  fill: OPTIONS extends { fill: boolean } ? OPTIONS['fill'] : ParsedValueDefaultOptions['fill']
  transform: OPTIONS extends { transform: boolean }
    ? OPTIONS['transform']
    : ParsedValueDefaultOptions['transform']
  mode: OPTIONS extends { mode: ParsingMode } ? OPTIONS['mode'] : ParsedValueDefaultOptions['mode']
  extension: OPTIONS extends { parseExtension: ExtensionParser }
    ? NonNullable<OPTIONS['parseExtension'][CONTEXT extends true ? $contextExtension : $extension]>
    : ParsedValueDefaultOptions['extension']
}
