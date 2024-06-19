import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'
import { EntityV2, EntityAction, $entity } from 'v1/entity'
import { KeyInput, EntityParser } from 'v1/entity/actions/parse'

export const $key = Symbol('$key')
export type $key = typeof $key

export class BatchDeleteItemRequest<
  ENTITY extends EntityV2 = EntityV2
> extends EntityAction<ENTITY> {
  static actionName = 'batchDelete' as const;

  [$key]?: KeyInput<ENTITY>

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>) {
    super(entity)
    this[$key] = key
  }

  key(nextKey: KeyInput<ENTITY>): BatchDeleteItemRequest<ENTITY> {
    return new BatchDeleteItemRequest(this[$entity], nextKey)
  }

  params(): NonNullable<BatchWriteCommandInput['RequestItems']>[string][number] {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'DeleteItemCommand incomplete: Missing "key" property'
      })
    }

    const { key } = this[$entity].build(EntityParser).parse(this[$key], { mode: 'key' })

    return { DeleteRequest: { Key: key } }
  }
}
