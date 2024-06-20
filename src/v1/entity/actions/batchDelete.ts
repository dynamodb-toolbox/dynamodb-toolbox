import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors/index.js'
import { EntityV2, EntityAction, $entity } from 'v1/entity/index.js'
import { KeyInput, EntityParser } from 'v1/entity/actions/parse.js'

export const $key = Symbol('$key')
export type $key = typeof $key

export class BatchDeleteRequest<ENTITY extends EntityV2 = EntityV2> extends EntityAction<ENTITY> {
  static actionName = 'batchDelete' as const;

  [$key]?: KeyInput<ENTITY>

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>) {
    super(entity)
    this[$key] = key
  }

  key(nextKey: KeyInput<ENTITY>): BatchDeleteRequest<ENTITY> {
    return new BatchDeleteRequest(this[$entity], nextKey)
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
