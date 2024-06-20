import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { PutItemInput } from '~/entity/actions/commands/putItem/index.js'
import { EntityParser } from '~/entity/actions/parse.js'
import type { EntityV2 } from '~/entity/index.js'

import type { PutItemTransactionOptions } from '../options.js'
import { parsePutItemTransactionOptions } from './parsePutItemOptions.js'

export type TransactPutItemParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['Put']
>

export const transactPutItemParams = <
  ENTITY extends EntityV2,
  OPTIONS extends PutItemTransactionOptions<ENTITY>
>(
  entity: ENTITY,
  input: PutItemInput<ENTITY>,
  putItemTransactionOptions: OPTIONS = {} as OPTIONS
): TransactPutItemParams => {
  const { item } = entity.build(EntityParser).parse(input)
  const options = parsePutItemTransactionOptions(entity, putItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Item: item,
    ...options
  }
}
