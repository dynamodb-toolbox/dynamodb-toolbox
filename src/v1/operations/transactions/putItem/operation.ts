import type { EntityV2 } from 'v1/entity'

import { DynamoDBToolboxError } from 'v1/errors'

import { $entity, EntityOperation } from '../../class'
import type { PutItemInput } from '../../putItem/types'
import { WriteItemTransaction } from '../types'
import {
  transactWritePutItemParams,
  TransactWritePutItemParams
} from './transactWritePutItemParams'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export const $item = Symbol('$item')
export type $item = typeof $item

export class PutItemTransaction<ENTITY extends EntityV2 = EntityV2>
  extends EntityOperation<ENTITY>
  implements WriteItemTransaction<ENTITY, 'Put'> {
  static operationName = 'transactPut' as const

  private [$item]?: PutItemInput<ENTITY>
  public item: (nextItem: PutItemInput<ENTITY>) => PutItemTransaction<ENTITY>

  constructor(entity: ENTITY, item?: PutItemInput<ENTITY>) {
    super(entity)
    this[$item] = item

    this.item = nextItem => new PutItemTransaction(this[$entity], nextItem)
  }

  params = (): TransactWritePutItemParams => {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('operations.incompleteCommand', {
        message: 'PutItemTransaction incomplete: Missing "item" property'
      })
    }

    return transactWritePutItemParams(this[$entity], this[$item])
  }

  get = (): {
    documentClient: DynamoDBDocumentClient
    type: 'Put'
    params: TransactWritePutItemParams
  } => ({
    documentClient: this[$entity].table.documentClient,
    type: 'Put',
    params: this.params()
  })
}

export type PutItemTransactionClass = typeof PutItemTransaction
