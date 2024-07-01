import type { BatchGetCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser, KeyInput } from '~/entity/actions/parse.js'
import { $entity, Entity, EntityAction } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

export const $key = Symbol('$key')
export type $key = typeof $key

export class BatchGetRequest<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
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
