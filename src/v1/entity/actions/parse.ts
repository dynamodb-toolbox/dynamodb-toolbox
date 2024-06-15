import { EntityV2, EntityAction, $entity } from 'v1/entity'
import {
  Parser,
  ParsingOptions,
  FromParsingOptions,
  ParsedValue,
  ParsedValueOptions,
  ParsedValueDefaultOptions
} from 'v1/schema/actions/parse'
import type { ParserInput } from 'v1/schema/actions/parse'
import { PrimaryKeyParser, PrimaryKey } from 'v1/table/actions/parsePrimaryKey'

export type ParsedItemOptions = Pick<ParsedValueOptions, 'mode' | 'extension'>

export type ParsedItemDefaultOptions = Pick<ParsedValueDefaultOptions, 'mode' | 'extension'>

export type ParsedItem<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends ParsedItemOptions = ParsedItemDefaultOptions
> = ParsedValue<ENTITY['schema'], OPTIONS>

export type SavedItem<ENTITY extends EntityV2 = EntityV2> = ParsedItem<ENTITY>

export type EntityParsingOptions = Pick<ParsingOptions, 'mode' | 'parseExtension'>

export type EntityParserInput<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends ParsedItemOptions = ParsedItemDefaultOptions
> = ParserInput<ENTITY['schema'], OPTIONS>

export type KeyInput<ENTITY extends EntityV2> = EntityParserInput<ENTITY, { mode: 'key' }>

const $parser = Symbol('$parser')
type $parser = typeof $parser

export class EntityParser<ENTITY extends EntityV2 = EntityV2> extends EntityAction<ENTITY> {
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
