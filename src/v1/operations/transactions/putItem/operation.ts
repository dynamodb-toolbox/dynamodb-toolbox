import type { EntityV2 } from 'v1/entity'

import { DynamoDBToolboxError } from 'v1/errors'

import { $entity, EntityOperation } from '../../class'
import type { PutItemInput } from '../../putItem/types'
import { WriteItemTransaction } from '../types'
import { transactPutItemParams, TransactPutItemParams } from './transactPutItemParams'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { PutItemTransactionOptions } from './options'

export const $item = Symbol('$item')
export type $item = typeof $item

export const $options = Symbol('$options')
export type $options = typeof $options

export class PutItemTransaction<
    ENTITY extends EntityV2 = EntityV2,
    OPTIONS extends PutItemTransactionOptions<ENTITY> = PutItemTransactionOptions<ENTITY>
  >
  extends EntityOperation<ENTITY>
  implements WriteItemTransaction<ENTITY, 'Put'> {
  static operationName = 'transactPut' as const

  private [$item]?: PutItemInput<ENTITY>
  public item: (nextItem: PutItemInput<ENTITY>) => PutItemTransaction<ENTITY>
  public [$options]: OPTIONS
  public options: <NEXT_OPTIONS extends PutItemTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => PutItemTransaction<ENTITY, NEXT_OPTIONS>

  constructor(entity: ENTITY, item?: PutItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$item] = item
    this[$options] = options

    this.item = nextItem => new PutItemTransaction(this[$entity], nextItem, this[$options])
    this.options = nextOptions => new PutItemTransaction(this[$entity], this[$item], nextOptions)
  }

  params = (): TransactPutItemParams => {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('operations.incompleteCommand', {
        message: 'PutItemTransaction incomplete: Missing "item" property'
      })
    }

    return transactPutItemParams(this[$entity], this[$item], this[$options])
  }

  get = (): {
    documentClient: DynamoDBDocumentClient
    type: 'Put'
    params: TransactPutItemParams
  } => ({
    documentClient: this[$entity].table.documentClient,
    type: 'Put',
    params: this.params()
  })
}

export type PutItemTransactionClass = typeof PutItemTransaction
