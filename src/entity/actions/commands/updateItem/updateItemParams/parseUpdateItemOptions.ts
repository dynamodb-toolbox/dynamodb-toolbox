import type { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { EntityV2 } from '~/entity/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseMetricsOption } from '~/options/metrics.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseReturnValuesOption } from '~/options/returnValues.js'

import { UpdateItemOptions, updateItemCommandReturnValuesOptionsSet } from '../options.js'

type CommandOptions = Omit<UpdateCommandInput, 'TableName' | 'Item' | 'Key'>

export const parseUpdateItemOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  updateItemOptions: UpdateItemOptions<ENTITY>
): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, condition, ...extraOptions } = updateItemOptions
  rejectExtraOptions(extraOptions)

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  if (returnValues !== undefined) {
    commandOptions.ReturnValues = parseReturnValuesOption(
      updateItemCommandReturnValuesOptionsSet,
      returnValues
    )
  }

  if (condition !== undefined) {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = entity.build(EntityConditionParser).parse(condition).toCommandOptions()

    commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    commandOptions.ExpressionAttributeValues = ExpressionAttributeValues
    commandOptions.ConditionExpression = ConditionExpression
  }

  return commandOptions
}
