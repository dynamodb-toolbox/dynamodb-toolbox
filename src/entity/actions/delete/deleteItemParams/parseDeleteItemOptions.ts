import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityConditionParser } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseMetricsOption } from '~/options/metrics.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseReturnValuesOption } from '~/options/returnValues.js'
import { isEmpty } from '~/utils/isEmpty.js'

import { deleteItemCommandReturnValuesOptionsSet } from '../options.js'
import type { DeleteItemOptions } from '../options.js'

type CommandOptions = Omit<DeleteCommandInput, 'TableName' | 'Key'>

type DeleteItemOptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  deleteItemOptions: DeleteItemOptions<ENTITY>
) => CommandOptions

export const parseDeleteItemOptions: DeleteItemOptionsParser = (entity, deleteItemOptions) => {
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
    const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = entity
      .build(EntityConditionParser)
      .parse(condition)
      .toCommandOptions()

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
