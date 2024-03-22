import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import isEmpty from 'lodash.isempty'
import omit from 'lodash.omit'

import type { EntityV2 } from 'v1/entity'
import type { UpdateItemInput } from 'v1/operations/updateItem'
import { parseUpdate } from 'v1/operations/updateItem/updateExpression/parse'
import { parseUpdateExtension } from 'v1/operations/updateItem/updateItemParams/extension/parseExtension'
import { PrimaryKeyParser } from 'v1/operations/primaryKeyParser'
import { Parser } from 'v1/schema/actions/parse'

import type { UpdateItemTransactionOptions } from '../options'

import { parseUpdateItemTransactionOptions } from './parseUpdateItemOptions'

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
  const parser = entity.schema.build(Parser).start(input, {
    operation: 'update',
    parseExtension: parseUpdateExtension
  })

  parser.next() // defaulted
  parser.next() // linked
  const validInput = parser.next().value
  const transformedInput = parser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validInput) : transformedInput
  const primaryKey = entity.build(PrimaryKeyParser).parse(keyInput)

  const {
    ExpressionAttributeNames: updateExpressionAttributeNames,
    ExpressionAttributeValues: updateExpressionAttributeValues,
    ...update
  } = parseUpdate(entity, omit(transformedInput, Object.keys(primaryKey)))

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
