import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import isEmpty from 'lodash.isempty'
import omit from 'lodash.omit'

import type { EntityV2 } from 'v1/entity'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'

import type { UpdateItemInput } from '../../../updateItem'
import { parseEntityUpdateTransactionInput } from './parseUpdateTransactionInput'
import type { UpdateItemTransactionOptions } from '../options'

import { parseUpdateItemTransactionOptions } from './parseUpdateItemOptions'
import { parseUpdate } from 'v1/operations/updateItem/updateExpression/parse'

export type TransactUpdateItemParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['Update']
>

export const transactUpdateItemParams = <
  ENTITY extends EntityV2,
  OPTIONS extends UpdateItemTransactionOptions<ENTITY>
>(
  entity: ENTITY,
  input: UpdateItemInput<ENTITY>,
  updateItemTransactionOptions: OPTIONS = {} as OPTIONS
): TransactUpdateItemParams => {
  const validInputParser = parseEntityUpdateTransactionInput(entity, input)
  const validInput = validInputParser.next().value
  const collapsedInput = validInputParser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validInput) : collapsedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const {
    ExpressionAttributeNames: updateExpressionAttributeNames,
    ExpressionAttributeValues: updateExpressionAttributeValues,
    ...update
  } = parseUpdate(entity, omit(collapsedInput, Object.keys(primaryKey)))

  const {
    ExpressionAttributeNames: optionsExpressionAttributeNames,
    ExpressionAttributeValues: optionsExpressionAttributeValues,
    ...options
  } = parseUpdateItemTransactionOptions(entity, updateItemTransactionOptions)

  const ExpressionAttributeNames = {
    ...optionsExpressionAttributeNames,
    ...updateExpressionAttributeNames
  }

  const ExpressionAttributeValues = {
    ...optionsExpressionAttributeValues,
    ...updateExpressionAttributeValues
  }

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    UpdateExpression: update.UpdateExpression,
    ...options,
    ...(!isEmpty(ExpressionAttributeNames) ? { ExpressionAttributeNames } : {}),
    ...(!isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : {})
  }
}
