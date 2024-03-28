import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { EntityParser } from 'v1/entity/actions/parse'
import type { PutItemInput } from 'v1/entity/actions/commands/putItem'

import type { PutItemTransactionOptions } from '../options'
import { parsePutItemTransactionOptions } from './parsePutItemOptions'

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
