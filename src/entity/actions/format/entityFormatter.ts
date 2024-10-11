import { EntityAction } from '~/entity/index.js'
import type { Entity, FormattedItem } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { Formatter } from '~/schema/actions/format/index.js'
import type { FormatValueOptions, InferValueOptions } from '~/schema/actions/format/index.js'

import { $formatter } from './constants.js'

export interface FormatItemOptions<ENTITY extends Entity = Entity>
  extends FormatValueOptions<ENTITY['schema']> {}

export interface InferReadItemOptions<
  ENTITY extends Entity,
  OPTIONS extends FormatItemOptions<ENTITY>
> extends InferValueOptions<ENTITY['schema'], OPTIONS> {}

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
    try {
      return this[$formatter].format(item, options)
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
