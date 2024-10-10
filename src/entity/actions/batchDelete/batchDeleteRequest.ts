import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse/index.js'
import { EntityAction } from '~/entity/index.js'
import type { Entity, KeyInputItem } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { $key } from './constants.js'

export class BatchDeleteRequest<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName = 'batchDelete' as const;

  [$key]?: KeyInputItem<ENTITY>

  constructor(entity: ENTITY, key?: KeyInputItem<ENTITY>) {
    super(entity)
    this[$key] = key
  }

  key(nextKey: KeyInputItem<ENTITY>): BatchDeleteRequest<ENTITY> {
    return new BatchDeleteRequest(this.entity, nextKey)
  }

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
