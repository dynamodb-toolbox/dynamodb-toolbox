import type { AttributeValue } from '@aws-sdk/client-dynamodb'

import { EntityParser } from '~/entity/actions/parse/index.js'
import type { PutItemInput } from '~/entity/actions/put/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Require } from '~/types/require.js'

import { WriteTransaction } from '../transactWrite/transaction.js'
import type {
  TransactWriteItem,
  WriteTransactionImplementation
} from '../transactWrite/transaction.js'
import { $item, $options } from './constants.js'
import type { PutTransactionOptions } from './options.js'
import { parseOptions } from './options.js'

export class PutTransaction<
    ENTITY extends Entity = Entity,
    OPTIONS extends PutTransactionOptions<ENTITY> = PutTransactionOptions<ENTITY>
  >
  extends WriteTransaction<ENTITY>
  implements WriteTransactionImplementation<ENTITY>
{
  static actionName = 'transactPut' as const;

  [$item]?: PutItemInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, item?: PutItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$item] = item
    this[$options] = options
  }

  item(nextItem: PutItemInput<ENTITY>): PutTransaction<ENTITY> {
    return new PutTransaction(this.entity, nextItem, this[$options])
  }

  options<NEXT_OPTIONS extends PutTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): PutTransaction<ENTITY, NEXT_OPTIONS> {
    return new PutTransaction(this.entity, this[$item], nextOptions)
  }

  params(): Require<TransactWriteItem, 'Put'> {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'PutTransaction incomplete: Missing "item" property'
      })
    }

    const { item } = this.entity.build(EntityParser).parse(this[$item])
    const options = parseOptions(this.entity, this[$options])

    return {
      Put: {
        TableName: this.entity.table.getName(),
        Item: item as Record<string, AttributeValue>,
        ...options
      }
    }
  }
}

export type PutTransactionClass = typeof PutTransaction
