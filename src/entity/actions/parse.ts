import { $entity, EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type {
  FromParsingOptions,
  ParsedValue,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingOptions
} from '~/schema/actions/parse/index.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'
import { PrimaryKeyParser } from '~/table/actions/parsePrimaryKey/index.js'
import type { PrimaryKey } from '~/table/actions/parsePrimaryKey/index.js'

export type ParsedItemOptions = Pick<ParsedValueOptions, 'mode' | 'extension'>

export type ParsedItemDefaultOptions = Pick<ParsedValueDefaultOptions, 'mode' | 'extension'>

export type ParsedItem<
  ENTITY extends Entity = Entity,
  OPTIONS extends ParsedItemOptions = ParsedItemDefaultOptions
> = ParsedValue<ENTITY['schema'], OPTIONS>

export type SavedItem<ENTITY extends Entity = Entity> = ParsedItem<ENTITY>

export type EntityParsingOptions = Pick<ParsingOptions, 'mode' | 'parseExtension'>

export type EntityParserInput<
  ENTITY extends Entity = Entity,
  OPTIONS extends ParsedItemOptions = ParsedItemDefaultOptions
> = ParserInput<ENTITY['schema'], OPTIONS>

export type KeyInput<ENTITY extends Entity> = EntityParserInput<ENTITY, { mode: 'key' }>

const $parser = Symbol('$parser')
type $parser = typeof $parser

export class EntityParser<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static actionName: 'parse';
  [$parser]: Parser<ENTITY['schema']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$parser] = new Parser(entity.schema)
  }

  parse<OPTIONS extends EntityParsingOptions>(
    input: { [KEY: string]: unknown },
    { mode, parseExtension }: OPTIONS = {} as OPTIONS
  ): {
    item: ParsedItem<ENTITY, FromParsingOptions<OPTIONS>> & PrimaryKey<ENTITY['table']>
    key: PrimaryKey<ENTITY['table']>
  } {
    const parser = this[$parser].start(input, { mode, parseExtension } as OPTIONS)
    parser.next() // defaulted
    parser.next() // linked
    const validKeyInput = parser.next().value
    const item = parser.next().value

    const keyInput = this[$entity].computeKey ? this[$entity].computeKey(validKeyInput) : item
    const key = new PrimaryKeyParser<ENTITY['table']>(this[$entity].table).parse(keyInput)

    return { item: { ...item, ...key }, key }
  }

  reparse<OPTIONS extends EntityParsingOptions>(
    input: EntityParserInput<ENTITY, OPTIONS>,
    options: OPTIONS = {} as OPTIONS
  ): {
    item: ParsedItem<ENTITY, FromParsingOptions<OPTIONS>>
    key: PrimaryKey<ENTITY['table']>
  } {
    return this.parse(input, options)
  }
}
