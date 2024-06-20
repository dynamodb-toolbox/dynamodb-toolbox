import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import type { EntityV2 } from '~/entity/index.js'

import type { DeleteItemTransactionOptions } from '../options.js'
import { parseDeleteItemTransactionOptions } from './parseDeleteItemOptions.js'

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
  const { key } = entity.build(EntityParser).parse(input, { mode: 'key' })
  const options = parseDeleteItemTransactionOptions(entity, deleteItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...options
  }
}
