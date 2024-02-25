import type { EntityV2, FormattedItem } from 'v1/entity'
import type { Paths } from 'v1/schema/actions/paths'
import { Formatter, FormatOptions, UnpackFormatOptions } from 'v1/schema/actions/format'
import { DynamoDBToolboxError } from 'v1/errors'

import { EntityOperation, $entity } from './class'

export const $formatter = Symbol('$formatter')
export type $formatter = typeof $formatter

export class EntityFormatter<ENTITY extends EntityV2 = EntityV2> extends EntityOperation<ENTITY> {
  static operationName: 'format';
  [$formatter]: Formatter<ENTITY['schema']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$formatter] = new Formatter<ENTITY['schema']>(entity.schema)
  }

  format<OPTIONS extends FormatOptions<Paths<ENTITY['schema']>>>(
    item: { [KEY in string]: unknown },
    options: OPTIONS = {} as OPTIONS
  ): FormattedItem<ENTITY, UnpackFormatOptions<OPTIONS>> {
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
