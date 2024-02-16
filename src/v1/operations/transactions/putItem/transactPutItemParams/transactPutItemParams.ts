import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import type { PutItemInput } from 'v1/operations/putItem'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'
import { Parser } from 'v1/schema/actions/parse'

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
  const workflow = entity.schema.build(Parser).workflow(input, {
    fill: 'put',
    transform: true,
    requiringOptions: new Set(['always', 'atLeastOnce'])
  })

  workflow.next() // defaulted
  workflow.next() // linked
  const validInput = workflow.next().value
  const transformedInput = workflow.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validInput) : transformedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const options = parsePutItemTransactionOptions(entity, putItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Item: { ...transformedInput, ...primaryKey },
    ...options
  }
}