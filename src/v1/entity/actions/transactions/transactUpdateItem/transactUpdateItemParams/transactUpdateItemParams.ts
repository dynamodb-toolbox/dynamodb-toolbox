import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import { isEmpty } from 'lodash'
import { omit } from 'lodash'

import type { EntityV2 } from 'v1/entity/index.js'
import { EntityParser } from 'v1/entity/actions/parse.js'
import type { UpdateItemInput } from 'v1/entity/actions/commands/updateItem/index.js'
import { parseUpdate } from 'v1/entity/actions/commands/updateItem/updateExpression/parse.js'
import { parseUpdateExtension } from 'v1/entity/actions/commands/updateItem/updateItemParams/extension/index.js'

import type { UpdateItemTransactionOptions } from '../options.js'

import { parseUpdateItemTransactionOptions } from './parseUpdateItemOptions.js'

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
  const { item, key } = entity.build(EntityParser).parse(input, {
    mode: 'update',
    parseExtension: parseUpdateExtension
  })

  const {
    ExpressionAttributeNames: updateExpressionAttributeNames,
    ExpressionAttributeValues: updateExpressionAttributeValues,
    ...update
  } = parseUpdate(entity, omit(item, Object.keys(key)))

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
    Key: key,
    UpdateExpression: update.UpdateExpression,
    ...options,
    ...(!isEmpty(ExpressionAttributeNames) ? { ExpressionAttributeNames } : {}),
    ...(!isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : {})
  }
}
