import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityConditionParser } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseMetricsOption } from '~/options/metrics.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseReturnValuesOption } from '~/options/returnValues.js'
import { parseTableNameOption } from '~/options/tableName.js'

import { updateAttributesCommandReturnValuesOptionsSet } from '../options.js'
import type { UpdateAttributesOptions } from '../options.js'

type CommandOptions = Omit<UpdateCommandInput, 'TableName' | 'Item' | 'Key'>

type UpdateAttributesOptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  updateItemOptions: UpdateAttributesOptions<ENTITY>
) => CommandOptions

export const parseUpdateAttributesOptions: UpdateAttributesOptionsParser = (
  entity,
  updateItemOptions
) => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, condition, tableName, ...extraOptions } =
    updateItemOptions
  rejectExtraOptions(extraOptions)

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  if (returnValues !== undefined) {
    commandOptions.ReturnValues = parseReturnValuesOption(
      updateAttributesCommandReturnValuesOptionsSet,
      returnValues
    )
  }

  if (condition !== undefined) {
    const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = entity
      .build(EntityConditionParser)
      .parse(condition)
      .toCommandOptions()

    commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    commandOptions.ExpressionAttributeValues = ExpressionAttributeValues
    commandOptions.ConditionExpression = ConditionExpression
  }

  if (tableName !== undefined) {
    // tableName is a meta-option, validated but not used here
    parseTableNameOption(tableName)
  }

  return commandOptions
}
