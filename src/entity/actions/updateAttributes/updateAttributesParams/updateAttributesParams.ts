import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse/index.js'
import { parseUpdate } from '~/entity/actions/update/updateExpression/index.js'
import type { Entity } from '~/entity/index.js'
import { isEmpty } from '~/utils/isEmpty.js'
import { omit } from '~/utils/omit.js'

import type { UpdateAttributesOptions } from '../options.js'
import type { UpdateAttributesInput } from '../types.js'
import { parseUpdateAttributesExtension } from './extension/index.js'
import { parseUpdateAttributesOptions } from './parseUpdateAttributesOptions.js'

type UpdateAttributesParamsGetter = <
  ENTITY extends Entity,
  OPTIONS extends UpdateAttributesOptions<ENTITY>
>(
  entity: ENTITY,
  input: UpdateAttributesInput<ENTITY>,
  updateItemOptions?: OPTIONS
) => UpdateCommandInput & { ToolboxItem: UpdateAttributesInput<ENTITY, true> }

export const updateAttributesParams: UpdateAttributesParamsGetter = <
  ENTITY extends Entity,
  OPTIONS extends UpdateAttributesOptions<ENTITY>
>(
  entity: ENTITY,
  input: UpdateAttributesInput<ENTITY>,
  options: OPTIONS = {} as OPTIONS
) => {
  const { parsedItem, item, key } = entity.build(EntityParser).parse(input, {
    mode: 'update',
    parseExtension: parseUpdateAttributesExtension
  })

  const {
    ExpressionAttributeNames: updateExpressionAttributeNames,
    ExpressionAttributeValues: updateExpressionAttributeValues,
    ...update
  } = parseUpdate(entity, omit(item, ...Object.keys(key)))

  const {
    ExpressionAttributeNames: optionsExpressionAttributeNames,
    ExpressionAttributeValues: optionsExpressionAttributeValues,
    ...awsOptions
  } = parseUpdateAttributesOptions(entity, options)

  const ExpressionAttributeNames = {
    ...optionsExpressionAttributeNames,
    ...updateExpressionAttributeNames
  }

  const ExpressionAttributeValues = {
    ...optionsExpressionAttributeValues,
    ...updateExpressionAttributeValues
  }

  return {
    TableName: options.tableName ?? entity.table.getName(),
    /**
     * @debt type "TODO: Rework extensions & not cast here (use `ParsedItem<ENTITY, { extension: UpdateItemExtension }>`)"
     */
    ToolboxItem: parsedItem as UpdateAttributesInput<ENTITY, true>,
    Key: key,
    ...update,
    ...awsOptions,
    ...(!isEmpty(ExpressionAttributeNames) ? { ExpressionAttributeNames } : {}),
    ...(!isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : {})
  }
}
