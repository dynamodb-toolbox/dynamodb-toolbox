import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { PutItemInput } from '~/entity/actions/commands/putItem/index.js'
import { EntityParser } from '~/entity/actions/parse.js'
import type { Entity } from '~/entity/index.js'

import type { PutItemTransactionOptions } from '../options.js'
import { parsePutItemTransactionOptions } from './parsePutItemOptions.js'

export type TransactPutItemParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['Put']
>

type TransactPutItemParamsGetter = <
  ENTITY extends Entity,
  OPTIONS extends PutItemTransactionOptions<ENTITY>
>(
  entity: ENTITY,
  input: PutItemInput<ENTITY>,
  putItemTransactionOptions?: OPTIONS
) => TransactPutItemParams

export const transactPutItemParams: TransactPutItemParamsGetter = <
  ENTITY extends Entity,
  OPTIONS extends PutItemTransactionOptions<ENTITY>
>(
  entity: ENTITY,
  input: PutItemInput<ENTITY>,
  putItemTransactionOptions: OPTIONS = {} as OPTIONS
) => {
  const { item } = entity.build(EntityParser).parse(input)
  const options = parsePutItemTransactionOptions(entity, putItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Item: item,
    ...options
  }
}
