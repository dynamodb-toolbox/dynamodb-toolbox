import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityParserInput } from '~/entity/actions/parse/index.js'
import { EntityParser } from '~/entity/actions/parse/index.js'
import { EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { $item } from './constants.js'

export class BatchPutRequest<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static actionName = 'batchPut' as const;

  [$item]?: EntityParserInput<ENTITY>

  constructor(entity: ENTITY, item?: EntityParserInput<ENTITY>) {
    super(entity)
    this[$item] = item
  }

  item(nextItem: EntityParserInput<ENTITY>): BatchPutRequest<ENTITY> {
    return new BatchPutRequest(this.entity, nextItem)
  }

  params(): NonNullable<BatchWriteCommandInput['RequestItems']>[string][number] {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchPutRequest incomplete: Missing "item" property'
      })
    }

    const { item } = this.entity.build(EntityParser).parse(this[$item])

    return { PutRequest: { Item: item } }
  }
}
