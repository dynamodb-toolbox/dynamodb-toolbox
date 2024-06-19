import type { BatchGetCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'
import { EntityV2, EntityAction, $entity } from 'v1/entity'
import { EntityParser, KeyInput } from 'v1/entity/actions/parse'

export const $key = Symbol('$key')
export type $key = typeof $key

export class BatchGetItemRequest<ENTITY extends EntityV2 = EntityV2> extends EntityAction<ENTITY> {
  static actionName = 'batchGet' as const;

  [$key]?: KeyInput<ENTITY>

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>) {
    super(entity)
    this[$key] = key
  }

  key(nextKey: KeyInput<ENTITY>): BatchGetItemRequest<ENTITY> {
    return new BatchGetItemRequest(this[$entity], nextKey)
  }

  params(): NonNullable<NonNullable<BatchGetCommandInput['RequestItems']>[string]['Keys']>[number] {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchGetItemRequest incomplete: Missing "key" property'
      })
    }

    const { key } = this[$entity].build(EntityParser).parse(this[$key], { mode: 'key' })

    return key
  }
}
