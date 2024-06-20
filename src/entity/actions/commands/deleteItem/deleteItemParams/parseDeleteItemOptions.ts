import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'
import { isEmpty } from 'lodash'

import type { EntityV2 } from '~/entity/index.js'
import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseMetricsOption } from '~/options/metrics.js'
import { parseReturnValuesOption } from '~/options/returnValues.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import { deleteItemCommandReturnValuesOptionsSet, DeleteItemOptions } from '../options.js'

type CommandOptions = Omit<DeleteCommandInput, 'TableName' | 'Key'>

export const parseDeleteItemOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  deleteItemOptions: DeleteItemOptions<ENTITY>
): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, condition, ...extraOptions } = deleteItemOptions

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  if (returnValues !== undefined) {
    commandOptions.ReturnValues = parseReturnValuesOption(
      deleteItemCommandReturnValuesOptionsSet,
      returnValues
    )
  }

  if (condition !== undefined) {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = entity.build(EntityConditionParser).parse(condition).toCommandOptions()

    if (!isEmpty(ExpressionAttributeNames)) {
      commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    }

    if (!isEmpty(ExpressionAttributeValues)) {
      commandOptions.ExpressionAttributeValues = ExpressionAttributeValues
    }

    commandOptions.ConditionExpression = ConditionExpression
  }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
