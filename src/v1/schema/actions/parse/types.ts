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

export type Operation = 'key' | 'put' | 'update'

export type ParsingOptions = {
  fill?: boolean
  transform?: boolean
  operation?: Operation
  parseExtension?: ExtensionParser
}

export type ParsingDefaultOptions = {
  fill: true
  transform: true
  operation: 'put'
  parseExtension: undefined
}

export type ParsedValueOptions = {
  fill?: boolean
  transform?: boolean
  operation?: Operation
  extension?: Extension
}

export type ParsedValueDefaultOptions = {
  fill: true
  transform: true
  operation: 'put'
  extension: undefined
}

export type FromParsingOptions<OPTIONS extends ParsingOptions, CONTEXT extends boolean = false> = {
  fill: OPTIONS extends { fill: boolean } ? OPTIONS['fill'] : ParsedValueDefaultOptions['fill']
  transform: OPTIONS extends { transform: boolean }
    ? OPTIONS['transform']
    : ParsedValueDefaultOptions['transform']
  operation: OPTIONS extends { operation: Operation }
    ? OPTIONS['operation']
    : ParsedValueDefaultOptions['operation']
  extension: OPTIONS extends { parseExtension: ExtensionParser }
    ? NonNullable<OPTIONS['parseExtension'][CONTEXT extends true ? $contextExtension : $extension]>
    : ParsedValueDefaultOptions['extension']
}
