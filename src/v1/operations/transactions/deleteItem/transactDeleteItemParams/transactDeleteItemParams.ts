import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'

import type { DeleteItemTransactionOptions } from '../options'

import { parseDeleteItemTransactionOptions } from './parseDeleteItemOptions'
import { KeyInput } from 'v1/operations/types'
import { parseEntityKeyInput } from 'v1/operations/utils/parseKeyInput'

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
  const validKeyInputParser = parseEntityKeyInput(entity, input)
  const validKeyInput = validKeyInputParser.next().value
  const collapsedInput = validKeyInputParser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : collapsedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const options = parseDeleteItemTransactionOptions(entity, deleteItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...options
  }
}
