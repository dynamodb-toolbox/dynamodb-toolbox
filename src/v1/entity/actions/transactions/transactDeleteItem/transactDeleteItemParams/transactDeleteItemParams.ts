import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { PrimaryKeyParser } from 'v1/table/actions/primaryKeyParser'
import type { EntityV2 } from 'v1/entity'
import { Parser } from 'v1/schema/actions/parse'
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
  const parser = entity.schema.build(Parser).start(input, { operation: 'key' })
  parser.next() // defaulted
  parser.next() // linked
  const validKeyInput = parser.next().value
  const transformedInput = parser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : transformedInput
  const primaryKey = entity.table.build(PrimaryKeyParser).parse(keyInput)

  const options = parseDeleteItemTransactionOptions(entity, deleteItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...options
  }
}
