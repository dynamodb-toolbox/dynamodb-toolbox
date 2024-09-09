import { EntityParser } from '~/entity/actions/parse/index.js'
import type { KeyInput } from '~/entity/actions/parse/index.js'
import { EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { NonNull } from '~/types/nonNull.js'

import type { TransactGetItem } from '../transaction.js'
import { $key, $options } from './constants.js'
import type { GetTransactionOptions } from './options.js'
import { parseOptions } from './options.js'

export class GetTransaction<
  ENTITY extends Entity = Entity,
  OPTIONS extends GetTransactionOptions<ENTITY> = GetTransactionOptions<ENTITY>
> extends EntityAction<ENTITY> {
  static override actionName = 'transactGet' as const;

  [$key]?: KeyInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$key] = key
    this[$options] = options
  }

  key(nextKey: KeyInput<ENTITY>): GetTransaction<ENTITY> {
    return new GetTransaction(this.entity, nextKey, this[$options])
  }

  options<NEXT_OPTIONS extends GetTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): GetTransaction<ENTITY, NEXT_OPTIONS> {
    return new GetTransaction(this.entity, this[$key], nextOptions)
  }

  params(): NonNull<TransactGetItem, 'Get'> {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'GetTransaction incomplete: Missing "key" property'
      })
    }

    const options = this[$options]
    const { key } = this.entity.build(EntityParser).parse(this[$key], { mode: 'key' })
    const awsOptions = parseOptions(this.entity, options)

    return {
      Get: {
        TableName: options.tableName ?? this.entity.table.getName(),
        Key: key,
        ...awsOptions
      }
    }
  }
}
