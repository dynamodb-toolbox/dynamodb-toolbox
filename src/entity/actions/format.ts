import { $entity, EntityAction, EntityV2 } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import {
  FormatOptions,
  FormattedValue,
  FormattedValueDefaultOptions,
  FormattedValueOptions,
  Formatter,
  FromFormatOptions
} from '~/schema/actions/format/index.js'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity
 *
 * @param Entity Entity
 * @return Object
 */
export type FormattedItem<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends FormattedValueOptions<ENTITY['schema']> = FormattedValueDefaultOptions
> = FormattedValue<ENTITY['schema'], OPTIONS>

export const $formatter = Symbol('$formatter')
export type $formatter = typeof $formatter

export class EntityFormatter<ENTITY extends EntityV2 = EntityV2> extends EntityAction<ENTITY> {
  static actionName: 'format';
  [$formatter]: Formatter<ENTITY['schema']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$formatter] = new Formatter(entity.schema)
  }

  format<OPTIONS extends FormatOptions<ENTITY['schema']>>(
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
