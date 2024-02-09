import type { GetItemTransactionOptions } from '../options'
import { parseGetItemTransactionOptions } from './parseGetItemOptions'
import type { TransactGetCommandInput } from '@aws-sdk/lib-dynamodb'
import type { EntityV2 } from 'v1/entity'
import { KeyInput } from 'v1/operations/types'
import { parseEntityKeyInput } from 'v1/operations/utils/parseKeyInput'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'

export type TransactGetItemParams = NonNullable<
  NonNullable<TransactGetCommandInput['TransactItems']>[number]['Get']
>

export const transactGetItemParams = <
  ENTITY extends EntityV2,
  OPTIONS extends GetItemTransactionOptions<ENTITY>
>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  GetItemTransactionOptions: OPTIONS = {} as OPTIONS
): TransactGetItemParams => {
  const validKeyInputParser = parseEntityKeyInput(entity, input)
  const validKeyInput = validKeyInputParser.next().value
  const transformedInput = validKeyInputParser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : transformedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const options = parseGetItemTransactionOptions(entity, GetItemTransactionOptions)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...options
  }
}
