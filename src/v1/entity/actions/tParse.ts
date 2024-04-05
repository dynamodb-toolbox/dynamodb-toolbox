import type { PrimaryKey } from 'v1/table/actions/parsePrimaryKey'
import { EntityV2, EntityAction } from 'v1/entity'
import {
  EntityParser,
  ParsedItemOptions,
  ParsedItemDefaultOptions,
  EntityParseOptions,
  ParsedItem
} from 'v1/entity/actions/parse'
import type { FromParsingOptions } from 'v1/schema/actions/parse'
import type { ParserInput } from 'v1/schema/actions/tParse'

export type EntityParserInput<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends ParsedItemOptions = ParsedItemDefaultOptions
> = ParserInput<ENTITY['schema'], OPTIONS>

export type KeyInput<ENTITY extends EntityV2> = EntityParserInput<ENTITY, { operation: 'key' }>

export class EntityTParser<ENTITY extends EntityV2 = EntityV2> extends EntityAction<ENTITY> {
  static actionName: 'tParse'
  parser: EntityParser<ENTITY>

  constructor(entity: ENTITY) {
    super(entity)
    this.parser = new EntityParser(entity)
  }

  parse<OPTIONS extends EntityParseOptions>(
    input: EntityParserInput<ENTITY, OPTIONS>,
    options: OPTIONS = {} as OPTIONS
  ): {
    item: ParsedItem<ENTITY, FromParsingOptions<OPTIONS>>
    key: PrimaryKey<ENTITY['table']>
  } {
    return this.parser.parse(input, options)
  }
}
