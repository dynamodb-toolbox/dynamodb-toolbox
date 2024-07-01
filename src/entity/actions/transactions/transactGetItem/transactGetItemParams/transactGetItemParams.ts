import type { TransactGetCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import type { Entity } from '~/entity/index.js'

import type { GetItemTransactionOptions } from '../options.js'
import { parseGetItemTransactionOptions } from './parseGetItemOptions.js'

export type TransactGetItemParams = NonNullable<
  NonNullable<TransactGetCommandInput['TransactItems']>[number]['Get']
>

type TransactGetItemParamsGetter = <
  ENTITY extends Entity,
  OPTIONS extends GetItemTransactionOptions<ENTITY>
>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  getItemTransactionOptions?: OPTIONS
) => TransactGetItemParams

export const transactGetItemParams: TransactGetItemParamsGetter = <
  ENTITY extends Entity,
  OPTIONS extends GetItemTransactionOptions<ENTITY>
>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  getItemTransactionOptions: OPTIONS = {} as OPTIONS
) => {
  const { key } = entity.build(EntityParser).parse(input, { mode: 'key' })
  const options = parseGetItemTransactionOptions(entity, getItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...options
  }
}
