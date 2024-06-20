import type { BatchGetCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors/index.js'
import { EntityV2, EntityAction, $entity } from 'v1/entity/index.js'
import { EntityParser, KeyInput } from 'v1/entity/actions/parse.js'

export const $key = Symbol('$key')
export type $key = typeof $key

export class BatchGetRequest<ENTITY extends EntityV2 = EntityV2> extends EntityAction<ENTITY> {
  static actionName = 'batchGet' as const;

  [$key]?: KeyInput<ENTITY>

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>) {
    super(entity)
    this[$key] = key
  }

  key(nextKey: KeyInput<ENTITY>): BatchGetRequest<ENTITY> {
    return new BatchGetRequest(this[$entity], nextKey)
  }

  params(): NonNullable<NonNullable<BatchGetCommandInput['RequestItems']>[string]['Keys']>[number] {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchGetRequest incomplete: Missing "key" property'
      })
    }

    const { key } = this[$entity].build(EntityParser).parse(this[$key], { mode: 'key' })

    return key
  }
}
