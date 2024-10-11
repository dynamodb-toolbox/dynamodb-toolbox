import type { Attribute, Extension } from '~/attributes/index.js'
import type {
  $contextExtension,
  $extension,
  ExtensionParser,
  FullValue,
  InputValue,
  Schema,
  TransformedValue,
  WriteMode
} from '~/schema/index.js'

/**
 * @deprecated Use ParseValueOptions
 */
export type ParsingOptions = {
  fill?: boolean
  transform?: boolean
  mode?: WriteMode
  parseExtension?: ExtensionParser
  defined?: boolean
}

/**
 * @deprecated
 */
export type ParsingDefaultOptions = {
  fill: true
  transform: true
  mode: 'put'
  parseExtension: undefined
  defined: false
}

/**
 * @deprecated
 */
export type ParsedValueOptions = {
  fill?: boolean
  transform?: boolean
  mode?: WriteMode
  extension?: Extension
  defined?: boolean
}

/**
 * @deprecated
 */
export type ParsedValueDefaultOptions = {
  fill: true
  transform: true
  mode: 'put'
  extension: undefined
  defined: false
}

/**
 * @deprecated
 */
export type FromParsingOptions<OPTIONS extends ParsingOptions, CONTEXT extends boolean = false> = {
  fill: OPTIONS extends { fill: boolean } ? OPTIONS['fill'] : ParsedValueDefaultOptions['fill']
  transform: OPTIONS extends { transform: boolean }
    ? OPTIONS['transform']
    : ParsedValueDefaultOptions['transform']
  mode: OPTIONS extends { mode: WriteMode } ? OPTIONS['mode'] : ParsedValueDefaultOptions['mode']
  extension: OPTIONS extends { parseExtension: ExtensionParser }
    ? NonNullable<OPTIONS['parseExtension'][CONTEXT extends true ? $contextExtension : $extension]>
    : ParsedValueDefaultOptions['extension']
  defined: OPTIONS extends { defined: boolean }
    ? OPTIONS['defined']
    : ParsedValueDefaultOptions['defined']
}

/**
 * @deprecated Use Value or TransformedValue instead
 */
export type ParsedValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = OPTIONS extends { transform: false }
  ? FullValue<SCHEMA, OPTIONS>
  : TransformedValue<SCHEMA, OPTIONS>

/**
 * @deprecated Use InputValue or Value instead
 */
export type ParserInput<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = OPTIONS extends { fill: false } ? FullValue<SCHEMA, OPTIONS> : InputValue<SCHEMA, OPTIONS>
