import { $entity, EntityOperation } from '../../class'
import type { BaseTransaction } from '../types'
import type { GetItemTransactionOptions } from './options'
import { transactGetItemParams, TransactGetItemParams } from './transactGetItemParams'
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { EntityV2 } from 'v1/entity'
import { DynamoDBToolboxError } from 'v1/errors'
import type { KeyInput } from 'v1/operations/types'

export const $key = Symbol('$key')
export type $key = typeof $key

export const $options = Symbol('$options')
export type $options = typeof $options

export class GetItemTransaction<
    ENTITY extends EntityV2 = EntityV2,
    OPTIONS extends GetItemTransactionOptions<ENTITY> = GetItemTransactionOptions<ENTITY>
  >
  extends EntityOperation<ENTITY>
  implements BaseTransaction {
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
    documentClient: this[$entity].table.documentClient,
    type: 'Get',
    params: this.params()
  })
}

export type GetItemTransactionClass = typeof GetItemTransaction
