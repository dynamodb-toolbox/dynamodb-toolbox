import type { TransactGetCommandInput } from '@aws-sdk/lib-dynamodb'

import { PrimaryKeyParser } from 'v1/table/actions/parsePrimaryKey'
import type { EntityV2 } from 'v1/entity'
import { Parser } from 'v1/schema/actions/parse'
import type { KeyInput } from 'v1/operations/types'

import type { GetItemTransactionOptions } from '../options'
import { parseGetItemTransactionOptions } from './parseGetItemOptions'

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
  const parser = entity.schema.build(Parser).start(input, { operation: 'key' })
  parser.next() // defaulted
  parser.next() // linked
  const validKeyInput = parser.next().value
  const transformedInput = parser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : transformedInput
  const primaryKey = entity.table.build(PrimaryKeyParser).parse(keyInput)

  const options = parseGetItemTransactionOptions(entity, getItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...options
  }
}
