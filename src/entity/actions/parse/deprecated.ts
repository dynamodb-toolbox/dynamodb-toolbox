import type { Entity } from '~/entity/index.js'
import type {
  ParsedValue,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParserInput,
  ParsingDefaultOptions
} from '~/schema/actions/parse/index.js'
import type { ExtensionParser, WriteMode } from '~/schema/index.js'

/**
 * @debt v2 "remove all those types"
 */

/**
 * @deprecated Use ParseItemOptions instead
 */
export interface EntityParsingOptions {
  mode?: WriteMode | undefined
  parseExtension?: ExtensionParser | undefined
}

/**
 * @deprecated Use Item or TransformedItem instead
 */
export type ParsedItemOptions = ParsedValueOptions

/**
 * @deprecated Use Item or TransformedItem instead
 */
export type ParsedItemDefaultOptions = ParsedValueDefaultOptions

/**
 * @deprecated Use Item or TransformedItem instead
 */
export type ParsedItem<
  ENTITY extends Entity = Entity,
  OPTIONS extends ParsedItemOptions = ParsedItemDefaultOptions
> = ParsedValue<ENTITY['schema'], OPTIONS>

/**
 * @deprecated Use `{}` instead
 */
export type EntityParsingDefaultOptions = Pick<ParsingDefaultOptions, 'mode' | 'parseExtension'>

/**
 * @deprecated Use InputItem instead
 */
export type EntityParserInput<
  ENTITY extends Entity = Entity,
  OPTIONS extends ParsedItemOptions = ParsedItemDefaultOptions
> = ParserInput<ENTITY['schema'], OPTIONS>

/**
 * @deprecated Use KeyInputItem instead
 */
export type KeyInput<ENTITY extends Entity> = EntityParserInput<ENTITY, { mode: 'key' }>
