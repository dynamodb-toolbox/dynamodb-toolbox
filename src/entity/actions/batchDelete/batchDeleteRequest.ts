import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse/index.js'
import { EntityAction } from '~/entity/index.js'
import type { Entity, KeyInputItem } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { $key } from './constants.js'

/** Build the deletion request of an entity item within a `BatchWriteCommand`. */
export class BatchDeleteRequest<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName = 'batchDelete' as const;

  [$key]?: KeyInputItem<ENTITY>

  /** Bind the request to an entity and a key. */
  constructor(entity: ENTITY, key?: KeyInputItem<ENTITY>) {
    super(entity)
    this[$key] = key
  }

  /** Set the key of the item to delete. */
  key(nextKey: KeyInputItem<ENTITY>): BatchDeleteRequest<ENTITY> {
    return new BatchDeleteRequest(this.entity, nextKey)
  }

  /** Build the raw AWS SDK `DeleteRequest` of the batch write request. */
  params(): NonNullable<BatchWriteCommandInput['RequestItems']>[string][number] {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'DeleteItemCommand incomplete: Missing "key" property'
      })
    }

    const { key } = this.entity.build(EntityParser).parse(this[$key], { mode: 'key' })

    return { DeleteRequest: { Key: key } }
  }
}
