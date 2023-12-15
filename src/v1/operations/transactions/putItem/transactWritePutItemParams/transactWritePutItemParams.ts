import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'

import type { PutItemInput } from '../../../putItem'
import { parseEntityPutTransactionInput } from './parsePutTransactionInput'

export type TransactWritePutItemParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['Put']
>

export const transactWritePutItemParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: PutItemInput<ENTITY>
): TransactWritePutItemParams => {
  const validInputParser = parseEntityPutTransactionInput(entity, input)
  const validInput = validInputParser.next().value
  const collapsedInput = validInputParser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validInput) : collapsedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  return {
    TableName: entity.table.getName(),
    Item: { ...collapsedInput, ...primaryKey }
  }
}
