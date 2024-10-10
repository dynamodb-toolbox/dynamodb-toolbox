import type { BatchGetCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse/index.js'
import { EntityAction } from '~/entity/index.js'
import type { Entity, KeyInputItem } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { $key } from './constants.js'

export class BatchGetRequest<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName = 'batchGet' as const;

  [$key]?: KeyInputItem<ENTITY>

  constructor(entity: ENTITY, key?: KeyInputItem<ENTITY>) {
    super(entity)
    this[$key] = key
  }

  key(nextKey: KeyInputItem<ENTITY>): BatchGetRequest<ENTITY> {
    return new BatchGetRequest(this.entity, nextKey)
  }

  params(): NonNullable<NonNullable<BatchGetCommandInput['RequestItems']>[string]['Keys']>[number] {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchGetRequest incomplete: Missing "key" property'
      })
    }

    const { key } = this.entity.build(EntityParser).parse(this[$key], { mode: 'key' })

    return key
  }
}
