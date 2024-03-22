import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity/class'
import type { EntityPaths } from 'v1/operations/paths'
import type { KeyInput } from 'v1/operations/types'
import { DynamoDBToolboxError } from 'v1/errors'

import { $entity, EntityOperation } from '../../class'
import type { BaseTransaction, GetTransactionParams } from '../types'
import type { GetItemTransactionOptions } from './options'
import { transactGetItemParams, TransactGetItemParams } from './transactGetItemParams'

export const $key = Symbol('$key')
export type $key = typeof $key

export const $options = Symbol('$options')
export type $options = typeof $options

export interface GetItemTransactionInterface<
  ENTITY extends EntityV2 = EntityV2,
  OPTIONS extends GetItemTransactionOptions<ENTITY> = {
    attributes?: EntityPaths<ENTITY>[]
  }
> extends BaseTransaction,
    EntityOperation<ENTITY> {
  [$options]: OPTIONS
  get: () => {
    documentClient: DynamoDBDocumentClient
    type: 'Get'
    params: GetTransactionParams
  }
}

export class GetItemTransaction<
    ENTITY extends EntityV2 = EntityV2,
    OPTIONS extends GetItemTransactionOptions<ENTITY> = GetItemTransactionOptions<ENTITY>
  >
  extends EntityOperation<ENTITY>
  implements GetItemTransactionInterface<ENTITY, OPTIONS> {
  static operationName = 'transactGet' as const;

  [$key]?: KeyInput<ENTITY>
  key: (keyInput: KeyInput<ENTITY>) => GetItemTransaction<ENTITY>;
  [$options]: OPTIONS
  options: <NEXT_OPTIONS extends GetItemTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ) => GetItemTransaction<ENTITY, NEXT_OPTIONS>

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$key] = key
    this[$options] = options

    this.key = nextKey => new GetItemTransaction(this[$entity], nextKey, this[$options])
    this.options = nextOptions => new GetItemTransaction(this[$entity], this[$key], nextOptions)
  }

  params = (): TransactGetItemParams => {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('operations.incompleteOperation', {
        message: 'GetItemTransaction incomplete: Missing "key" property'
      })
    }

    return transactGetItemParams(this[$entity], this[$key], this[$options])
  }

  get = (): {
    documentClient: DynamoDBDocumentClient
    type: 'Get'
    params: TransactGetItemParams
  } => ({
    documentClient: this[$entity].table.getDocumentClient(),
    type: 'Get',
    params: this.params()
  })
}

export type GetItemTransactionClass = typeof GetItemTransaction
