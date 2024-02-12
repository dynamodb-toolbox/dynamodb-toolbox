import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import isEmpty from 'lodash.isempty'
import omit from 'lodash.omit'

import type { EntityV2 } from 'v1/entity'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'
import { Parser } from 'v1/schema/actions/parse'

import type { UpdateItemInput } from '../types'
import type { UpdateItemOptions } from '../options'
import { parseUpdate } from '../updateExpression'
import { parseUpdateExtension } from './extension/parseExtension'
import { parseUpdateItemOptions } from './parseUpdateItemOptions'

export const updateItemParams = <
  ENTITY extends EntityV2,
  OPTIONS extends UpdateItemOptions<ENTITY>
>(
  entity: ENTITY,
  input: UpdateItemInput<ENTITY>,
  updateItemOptions: OPTIONS = {} as OPTIONS
): UpdateCommandInput => {
  const workflow = entity.schema.build(Parser).workflow(input, {
    fill: 'update',
    transform: true,
    requiringOptions: new Set(['always']),
    parseExtension: parseUpdateExtension
  })

  workflow.next() // defaulted
  workflow.next() // linked
  const validInput = workflow.next().value
  const transformedInput = workflow.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validInput) : transformedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const {
    ExpressionAttributeNames: updateExpressionAttributeNames,
    ExpressionAttributeValues: updateExpressionAttributeValues,
    ...update
  } = parseUpdate(entity, omit(transformedInput, Object.keys(primaryKey)))

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
    Key: primaryKey,
    ...update,
    ...options,
    ...(!isEmpty(ExpressionAttributeNames) ? { ExpressionAttributeNames } : {}),
    ...(!isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : {})
  }
}
