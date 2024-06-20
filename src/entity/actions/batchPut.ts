import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { EntityV2, EntityAction, $entity } from '~/entity/index.js'
import { EntityParser, EntityParserInput } from '~/entity/actions/parse.js'

export const $item = Symbol('$item')
export type $item = typeof $item

export class BatchPutRequest<ENTITY extends EntityV2 = EntityV2> extends EntityAction<ENTITY> {
  static actionName = 'batchPut' as const;

  [$item]?: EntityParserInput<ENTITY>

  constructor(entity: ENTITY, item?: EntityParserInput<ENTITY>) {
    super(entity)
    this[$item] = item
  }

  item(nextItem: EntityParserInput<ENTITY>): BatchPutRequest<ENTITY> {
    return new BatchPutRequest(this[$entity], nextItem)
  }

  params(): NonNullable<BatchWriteCommandInput['RequestItems']>[string][number] {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchPutRequest incomplete: Missing "item" property'
      })
    }

    const { item } = this[$entity].build(EntityParser).parse(this[$item])

    return { PutRequest: { Item: item } }
  }
}
