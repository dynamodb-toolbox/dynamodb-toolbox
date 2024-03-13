import type { Extension, Schema, Attribute, AttributeBasicValue } from 'v1/schema'

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
  parseExtension?: undefined
}

export type ParsedValueOptions = {
  transform?: boolean
  operation?: Operation
  extension?: Extension
}

export type ParsedValueDefaultOptions = {
  transform: true
  operation: 'put'
}

export type FromParsingOptions<OPTIONS extends ParsingOptions, CONTEXT extends boolean = false> = {
  transform: OPTIONS['transform'] extends boolean
    ? OPTIONS['transform']
    : ParsedValueDefaultOptions['transform']
  operation: OPTIONS['operation'] extends Operation
    ? OPTIONS['operation']
    : ParsedValueDefaultOptions['operation']
  extension: OPTIONS['parseExtension'] extends ExtensionParser
    ? NonNullable<OPTIONS['parseExtension'][CONTEXT extends true ? $contextExtension : $extension]>
    : undefined
}
