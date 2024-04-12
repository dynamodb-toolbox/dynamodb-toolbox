import { EntityV2, EntityAction, $entity } from 'v1/entity'
import {
  Parser,
  ParsingOptions,
  FromParsingOptions,
  ParsedValue,
  ParsedValueOptions,
  ParsedValueDefaultOptions
} from 'v1/schema/actions/parse'
import { PrimaryKeyParser, PrimaryKey } from 'v1/table/actions/parsePrimaryKey'

export type ParsedItemOptions = Pick<ParsedValueOptions, 'operation' | 'extension'>

export type ParsedItemDefaultOptions = Pick<ParsedValueDefaultOptions, 'operation' | 'extension'>

export type ParsedItem<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends ParsedItemOptions = ParsedItemDefaultOptions
> = ParsedValue<ENTITY['schema'], OPTIONS>

export type SavedItem<ENTITY extends EntityV2 = EntityV2> = ParsedItem<ENTITY>

export type EntityParseOptions = Pick<ParsingOptions, 'operation' | 'parseExtension'>

const $parser = Symbol('$parser')
type $parser = typeof $parser

export class EntityParser<ENTITY extends EntityV2 = EntityV2> extends EntityAction<ENTITY> {
  static actionName: 'parse';
  [$parser]: Parser<ENTITY['schema']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$parser] = new Parser(entity.schema)
  }

  parse<OPTIONS extends EntityParseOptions>(
    input: { [KEY: string]: unknown },
    { operation, parseExtension }: OPTIONS = {} as OPTIONS
  ): {
    item: ParsedItem<ENTITY, FromParsingOptions<OPTIONS>> & PrimaryKey<ENTITY['table']>
    key: PrimaryKey<ENTITY['table']>
  } {
    const parser = this[$parser].start(input, { operation, parseExtension } as OPTIONS)
    parser.next() // defaulted
    parser.next() // linked
    const validKeyInput = parser.next().value
    const item = parser.next().value

    const keyInput = this[$entity].computeKey ? this[$entity].computeKey(validKeyInput) : item
    const key = new PrimaryKeyParser<ENTITY['table']>(this[$entity].table).parse(keyInput)

    return { item: { ...item, ...key }, key }
  }
}
