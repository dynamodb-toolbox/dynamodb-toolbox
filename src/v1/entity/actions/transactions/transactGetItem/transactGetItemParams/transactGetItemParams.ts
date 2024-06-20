import type { TransactGetCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity/index.js'
import { EntityParser } from 'v1/entity/actions/parse.js'
import type { KeyInput } from 'v1/entity/actions/parse.js'

import type { GetItemTransactionOptions } from '../options.js'
import { parseGetItemTransactionOptions } from './parseGetItemOptions.js'

export type TransactGetItemParams = NonNullable<
  NonNullable<TransactGetCommandInput['TransactItems']>[number]['Get']
>

export const transactGetItemParams = <
  ENTITY extends EntityV2,
  OPTIONS extends GetItemTransactionOptions<ENTITY>
>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  getItemTransactionOptions: OPTIONS = {} as OPTIONS
): TransactGetItemParams => {
  const { key } = entity.build(EntityParser).parse(input, { mode: 'key' })
  const options = parseGetItemTransactionOptions(entity, getItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...options
  }
}
