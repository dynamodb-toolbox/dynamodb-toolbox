import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { EntityParser } from 'v1/entity/actions/parse'
import type { KeyInput } from 'v1/operations/types'

import type { DeleteItemTransactionOptions } from '../options'
import { parseDeleteItemTransactionOptions } from './parseDeleteItemOptions'

export type TransactDeleteItemParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['Delete']
>

export const transactDeleteItemParams = <
  ENTITY extends EntityV2,
  OPTIONS extends DeleteItemTransactionOptions<ENTITY>
>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  deleteItemTransactionOptions: OPTIONS = {} as OPTIONS
): TransactDeleteItemParams => {
  const { key } = entity.build(EntityParser).parse(input, { operation: 'key' })
  const options = parseDeleteItemTransactionOptions(entity, deleteItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...options
  }
}
