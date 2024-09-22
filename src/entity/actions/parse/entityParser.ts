import { EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type {
  FromParsingOptions,
  ParsedValue,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingDefaultOptions,
  ParsingOptions
} from '~/schema/actions/parse/index.js'
import type { ParserInput } from '~/schema/actions/parse/index.js'
import { PrimaryKeyParser } from '~/table/actions/parsePrimaryKey/index.js'
import type { PrimaryKey } from '~/table/actions/parsePrimaryKey/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { $parser } from './constants.js'

export type ParsedItemOptions = ParsedValueOptions

export type ParsedItemDefaultOptions = ParsedValueDefaultOptions

export type ParsedItem<
  ENTITY extends Entity = Entity,
  OPTIONS extends ParsedItemOptions = ParsedItemDefaultOptions
> = ParsedValue<ENTITY['schema'], OPTIONS>

export type SavedItem<ENTITY extends Entity = Entity> = ParsedItem<ENTITY> &
  PrimaryKey<ENTITY['table']>

export type EntityParsingOptions = Pick<ParsingOptions, 'mode' | 'parseExtension'>

export type EntityParsingDefaultOptions = Pick<ParsingDefaultOptions, 'mode' | 'parseExtension'>

export type FromEntityParsingOptions<OPTIONS extends EntityParsingOptions> =
  FromParsingOptions<OPTIONS>

export type EntityParserInput<
  ENTITY extends Entity = Entity,
  OPTIONS extends ParsedItemOptions = ParsedItemDefaultOptions
> = ParserInput<ENTITY['schema'], OPTIONS>

export type KeyInput<ENTITY extends Entity> = EntityParserInput<ENTITY, { mode: 'key' }>

export class EntityParser<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName: 'parse';
  [$parser]: Parser<ENTITY['schema']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$parser] = new Parser(entity.schema)
  }

  parse<OPTIONS extends EntityParsingOptions = EntityParsingDefaultOptions>(
    input: { [KEY: string]: unknown },
    { mode, parseExtension }: OPTIONS = {} as OPTIONS
  ): {
    parsedItem: ParsedItem<
      ENTITY,
      // TODO: Just use {} as default options
      Overwrite<FromEntityParsingOptions<OPTIONS>, { transform: false }>
    >
    item: ParsedItem<ENTITY, FromEntityParsingOptions<OPTIONS>> & PrimaryKey<ENTITY['table']>
    key: PrimaryKey<ENTITY['table']>
  } {
    const parser = this[$parser].start(input, { mode, parseExtension } as OPTIONS)
    parser.next() // defaulted
    parser.next() // linked
    const parsedItem = parser.next().value
    const item = parser.next().value

    const keyInput = this.entity.computeKey ? this.entity.computeKey(parsedItem) : item
    const key = new PrimaryKeyParser<ENTITY['table']>(this.entity.table).parse(keyInput)

    return {
      /**
       * @debt type "we could remove this cast by using named generator yields: const parsedItem = parser.next<"parsed">().value"
       */
      parsedItem: parsedItem as ParsedItem<
        ENTITY,
        Overwrite<FromEntityParsingOptions<OPTIONS>, { transform: false }>
      >,
      item: { ...item, ...key },
      key
    }
  }

  reparse<OPTIONS extends EntityParsingOptions = EntityParsingDefaultOptions>(
    input: EntityParserInput<ENTITY, OPTIONS>,
    options: OPTIONS = {} as OPTIONS
  ): {
    parsedItem: ParsedItem<
      ENTITY,
      Overwrite<FromEntityParsingOptions<OPTIONS>, { transform: false }>
    >
    item: ParsedItem<ENTITY, FromEntityParsingOptions<OPTIONS>> & PrimaryKey<ENTITY['table']>
    key: PrimaryKey<ENTITY['table']>
  } {
    return this.parse(input, options)
  }
}
