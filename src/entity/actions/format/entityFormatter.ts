import type { Entity, FormattedItem } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { Formatter } from '~/schema/actions/format/index.js'

import { $formatter } from './constants.js'
import type { FormatItemOptions, InferReadItemOptions } from './options.js'

export class EntityFormatter<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName: 'format';
  [$formatter]: Formatter<ENTITY['schema']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$formatter] = new Formatter(entity.schema)
  }

  format<OPTIONS extends FormatItemOptions<ENTITY> = {}>(
    item: { [KEY: string]: unknown },
    options: OPTIONS = {} as OPTIONS
  ): FormattedItem<ENTITY, InferReadItemOptions<ENTITY, OPTIONS>> {
    const { transform = true } = options
    const { entityAttributeSavedAs } = this.entity.table

    try {
      const formatter = this[$formatter].start(
        {
          ...item,
          ...(item[entityAttributeSavedAs] === undefined
            ? { [entityAttributeSavedAs]: this.entity.name }
            : {})
        },
        { ...options, format: true }
      )
      if (transform) {
        formatter.next() // transformed
      }

      const formattedItem = formatter.next().value as FormattedItem<
        ENTITY,
        InferReadItemOptions<ENTITY, OPTIONS>
      >

      return formattedItem
    } catch (error) {
      if (!DynamoDBToolboxError.match(error, 'formatter.')) throw error

      const partitionKey = item[this.entity.table.partitionKey.name]
      const sortKey = this.entity.table.sortKey && item[this.entity.table.sortKey.name]
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
