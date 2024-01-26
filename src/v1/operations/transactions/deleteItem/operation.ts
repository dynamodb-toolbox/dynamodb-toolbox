import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { DynamoDBToolboxError } from 'v1/errors'
import type { KeyInput } from 'v1/operations/types'

import { $entity, EntityOperation } from '../../class'
import type { DeleteItemTransactionOptions } from './options'
import { transactDeleteItemParams, TransactDeleteItemParams } from './transactDeleteItemParams'
import type { WriteItemTransaction } from '../types'

export const $key = Symbol('$key')
export type $key = typeof $key

export const $options = Symbol('$options')
export type $options = typeof $options

export class DeleteItemTransaction<
    ENTITY extends EntityV2 = EntityV2,
    OPTIONS extends DeleteItemTransactionOptions<ENTITY> = DeleteItemTransactionOptions<ENTITY>
  >
  extends EntityOperation<ENTITY>
  implements WriteItemTransaction<ENTITY, 'Delete'> {
  static operationName = 'transactDelete' as const;

  [$key]?: KeyInput<ENTITY>
  key: (keyInput: KeyInput<ENTITY>) => DeleteItemTransaction<ENTITY>;
  [$options]: OPTIONS
  options: <NEXT_OPTIONS extends DeleteItemTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => DeleteItemTransaction<ENTITY, NEXT_OPTIONS>

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$key] = key
    this[$options] = options

    this.key = nextKey => new DeleteItemTransaction(this[$entity], nextKey, this[$options])
    this.options = nextOptions => new DeleteItemTransaction(this[$entity], this[$key], nextOptions)
  }

  params = (): TransactDeleteItemParams => {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('operations.incompleteOperation', {
        message: 'DeleteItemTransaction incomplete: Missing "key" property'
      })
    }

    return transactDeleteItemParams(this[$entity], this[$key], this[$options])
  }

  get = (): {
    documentClient: DynamoDBDocumentClient
    type: 'Delete'
    params: TransactDeleteItemParams
  } => ({
    documentClient: this[$entity].table.documentClient,
    type: 'Delete',
    params: this.params()
  })
}

export type DeleteItemTransactionClass = typeof DeleteItemTransaction
