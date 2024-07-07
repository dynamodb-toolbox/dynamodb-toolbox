import { $entity, EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { Formatter } from '~/schema/actions/format/index.js'
import type {
  FormatOptions,
  FormattedValue,
  FormattedValueDefaultOptions,
  FormattedValueOptions,
  FromFormatOptions
} from '~/schema/actions/format/index.js'

export type FormattedItemOptions<ENTITY extends Entity = Entity> = FormattedValueOptions<
  ENTITY['schema']
>

type FormattedItemOptionsDefault = FormattedValueDefaultOptions

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity
 *
 * @param Entity Entity
 * @return Object
 */
export type FormattedItem<
  ENTITY extends Entity = Entity,
  OPTIONS extends FormattedItemOptions<ENTITY> = FormattedItemOptionsDefault
> = FormattedValue<ENTITY['schema'], OPTIONS>

export type EntityFormattingOptions<ENTITY extends Entity = Entity> = FormatOptions<
  ENTITY['schema']
>

const $formatter = Symbol('$formatter')
type $formatter = typeof $formatter

export class EntityFormatter<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static actionName: 'format';
  [$formatter]: Formatter<ENTITY['schema']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$formatter] = new Formatter(entity.schema)
  }

  format<OPTIONS extends EntityFormattingOptions<ENTITY>>(
    item: { [KEY: string]: unknown },
    options: OPTIONS = {} as OPTIONS
  ): FormattedItem<ENTITY, FromFormatOptions<ENTITY['schema'], OPTIONS>> {
    try {
      return this[$formatter].format(item, options)
    } catch (error) {
      if (!DynamoDBToolboxError.match(error, 'formatter.')) throw error

      const partitionKey = item[this[$entity].table.partitionKey.name]
      const sortKey = this[$entity].table.sortKey && item[this[$entity].table.sortKey.name]
      if (partitionKey === undefined && sortKey === undefined) {
        throw error
      }

      const itemPrimaryKeyMessage =
        partitionKey &&
        [
          partitionKey && `Partition key: ${String(partitionKey)}`,
          sortKey && `Sort key: ${String(sortKey)}`
        ]
          .filter(Boolean)
          .join(' / ')

      error.message += ` ${itemPrimaryKeyMessage}`
      error.payload.partitionKey = partitionKey
      error.payload.sortKey = sortKey

      throw error
    }
  }
}
