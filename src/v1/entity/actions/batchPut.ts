import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'
import { EntityV2, EntityAction, $entity } from 'v1/entity'
import { EntityParser, EntityParserInput } from 'v1/entity/actions/parse'

export const $item = Symbol('$item')
export type $item = typeof $item

export class BatchPutItemRequest<ENTITY extends EntityV2 = EntityV2> extends EntityAction<ENTITY> {
  static actionName = 'batchPut' as const;

  [$item]?: EntityParserInput<ENTITY>

  constructor(entity: ENTITY, item?: EntityParserInput<ENTITY>) {
    super(entity)
    this[$item] = item
  }

  item(nextItem: EntityParserInput<ENTITY>): BatchPutItemRequest<ENTITY> {
    return new BatchPutItemRequest(this[$entity], nextItem)
  }

  params(): NonNullable<BatchWriteCommandInput['RequestItems']>[string][number] {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchPutItemRequest incomplete: Missing "item" property'
      })
    }

    const { item } = this[$entity].build(EntityParser).parse(this[$item])

    return { PutRequest: { Item: item } }
  }
}
