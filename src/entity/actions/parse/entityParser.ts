import type { WriteItemOptions } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import type { Entity, InputItem, TransformedItem, ValidItem } from '~/entity/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import { PrimaryKeyParser } from '~/table/actions/parsePrimaryKey/index.js'
import type { PrimaryKey } from '~/table/actions/parsePrimaryKey/index.js'

import { $parser } from './constants.js'
import type { InferWriteItemOptions, ParseItemOptions } from './options.js'

type EntityParserInput<
  ENTITY extends Entity,
  OPTIONS extends ParseItemOptions = {},
  WRITE_ITEM_OPTIONS extends WriteItemOptions = InferWriteItemOptions<OPTIONS>
> = OPTIONS extends { fill: false }
  ? ValidItem<ENTITY, WRITE_ITEM_OPTIONS>
  : InputItem<ENTITY, WRITE_ITEM_OPTIONS>

export class EntityParser<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName: 'parse';
  [$parser]: Parser<ENTITY['schema']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$parser] = new Parser(entity.schema)
  }

  parse<OPTIONS extends ParseItemOptions = {}>(
    input: unknown,
    options: OPTIONS = {} as OPTIONS
  ): {
    parsedItem: ValidItem<ENTITY, InferWriteItemOptions<OPTIONS>>
    item: TransformedItem<ENTITY, InferWriteItemOptions<OPTIONS>> & PrimaryKey<ENTITY['table']>
    key: PrimaryKey<ENTITY['table']>
  } {
    const { fill = true } = options
    const parser = this[$parser].start(input, { ...options, transform: true } as OPTIONS)

    if (fill) {
      parser.next() // defaulted
      parser.next() // linked
    }

    /**
     * @debt type "we could remove those casts by using named generator yields: const parsedItem = parser.next<"parsed">().value"
     */
    const parsedItem = parser.next().value as ValidItem<ENTITY, InferWriteItemOptions<OPTIONS>>
    const item = parser.next().value as TransformedItem<ENTITY, InferWriteItemOptions<OPTIONS>>

    const keyInput = this.entity.computeKey ? this.entity.computeKey(parsedItem) : item
    const key = new PrimaryKeyParser<ENTITY['table']>(this.entity.table).parse(keyInput)

    return {
      parsedItem: parsedItem,
      item: { ...item, ...key },
      key
    }
  }

  reparse<OPTIONS extends ParseItemOptions = {}>(
    input: EntityParserInput<ENTITY, InferWriteItemOptions<OPTIONS>>,
    options: OPTIONS = {} as OPTIONS
  ): {
    parsedItem: ValidItem<ENTITY, InferWriteItemOptions<OPTIONS>>
    item: TransformedItem<ENTITY, InferWriteItemOptions<OPTIONS>> & PrimaryKey<ENTITY['table']>
    key: PrimaryKey<ENTITY['table']>
  } {
    return this.parse(input, options)
  }
}
