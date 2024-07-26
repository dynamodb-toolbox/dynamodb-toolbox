import { EntityParser } from '~/entity/actions/parse/index.js'
import type { UpdateItemInput } from '~/entity/actions/update/index.js'
import { parseUpdate } from '~/entity/actions/update/updateExpression/parse.js'
import { parseUpdateExtension } from '~/entity/actions/update/updateItemParams/extension/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Require } from '~/types/require.js'
import { isEmpty } from '~/utils/isEmpty.js'
import { omit } from '~/utils/omit.js'

import type {
  TransactWriteItem,
  WriteTransactionImplementation
} from '../transactWrite/transaction.js'
import { WriteTransaction } from '../transactWrite/transaction.js'
import { $item, $options } from './constants.js'
import { parseOptions } from './options.js'
import type { UpdateTransactionOptions } from './options.js'

export class UpdateTransaction<
    ENTITY extends Entity = Entity,
    OPTIONS extends UpdateTransactionOptions<ENTITY> = UpdateTransactionOptions<ENTITY>
  >
  extends WriteTransaction<ENTITY>
  implements WriteTransactionImplementation<ENTITY>
{
  static actionName = 'transactUpdate' as const;

  [$item]?: UpdateItemInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, item?: UpdateItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$item] = item
    this[$options] = options
  }

  item(nextItem: UpdateItemInput<ENTITY>): UpdateTransaction<ENTITY> {
    return new UpdateTransaction(this.entity, nextItem, this[$options])
  }

  options<NEXT_OPTIONS extends UpdateTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): UpdateTransaction<ENTITY, NEXT_OPTIONS> {
    return new UpdateTransaction(this.entity, this[$item], nextOptions)
  }

  params(): Require<TransactWriteItem, 'Update'> {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'UpdateTransaction incomplete: Missing "item" property'
      })
    }

    const { item, key } = this.entity.build(EntityParser).parse(this[$item], {
      mode: 'update',
      parseExtension: parseUpdateExtension
    })

    const {
      ExpressionAttributeNames: updateExpressionAttributeNames,
      ExpressionAttributeValues: updateExpressionAttributeValues,
      UpdateExpression
    } = parseUpdate(this.entity, omit(item, ...Object.keys(key)))

    const {
      ExpressionAttributeNames: optionsExpressionAttributeNames,
      ExpressionAttributeValues: optionsExpressionAttributeValues,
      ...options
    } = parseOptions(this.entity, this[$options])

    const ExpressionAttributeNames = {
      ...optionsExpressionAttributeNames,
      ...updateExpressionAttributeNames
    }

    const ExpressionAttributeValues = {
      ...optionsExpressionAttributeValues,
      ...updateExpressionAttributeValues
    }

    return {
      Update: {
        TableName: this.entity.table.getName(),
        Key: key,
        UpdateExpression,
        ...options,
        ...(!isEmpty(ExpressionAttributeNames) ? { ExpressionAttributeNames } : {}),
        ...(!isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : {})
      }
    }
  }
}

export type UpdateTransactionClass = typeof UpdateTransaction
