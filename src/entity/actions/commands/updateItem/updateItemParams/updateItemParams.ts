import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import { isEmpty } from 'lodash'
import { omit } from 'lodash'

import { EntityParser } from '~/entity/actions/parse.js'
import type { EntityV2 } from '~/entity/index.js'

import type { UpdateItemOptions } from '../options.js'
import type { UpdateItemInput } from '../types.js'
import { parseUpdate } from '../updateExpression/index.js'
import { parseUpdateExtension } from './extension/index.js'
import { parseUpdateItemOptions } from './parseUpdateItemOptions.js'

export const updateItemParams = <
  ENTITY extends EntityV2,
  OPTIONS extends UpdateItemOptions<ENTITY>
>(
  entity: ENTITY,
  input: UpdateItemInput<ENTITY>,
  updateItemOptions: OPTIONS = {} as OPTIONS
): UpdateCommandInput => {
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
  } = parseUpdateItemOptions(entity, updateItemOptions)

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
    ...update,
    ...options,
    ...(!isEmpty(ExpressionAttributeNames) ? { ExpressionAttributeNames } : {}),
    ...(!isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : {})
  }
}
