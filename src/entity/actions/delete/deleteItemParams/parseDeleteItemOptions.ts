import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityConditionParser } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseMetricsOption } from '~/options/metrics.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseReturnValuesOption } from '~/options/returnValues.js'
import { parseReturnValuesOnConditionFalseOption } from '~/options/returnValuesOnConditionFalse.js'
import { parseTableNameOption } from '~/options/tableName.js'
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

  const {
    capacity,
    metrics,
    returnValues,
    returnValuesOnConditionFalse,
    condition,
    tableName,
    ...extraOptions
  } = deleteItemOptions
  rejectExtraOptions(extraOptions)

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

  if (returnValuesOnConditionFalse !== undefined) {
    commandOptions.ReturnValuesOnConditionCheckFailure = parseReturnValuesOnConditionFalseOption(
      returnValuesOnConditionFalse
    )
  }

  if (condition !== undefined) {
    const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = entity
      .build(EntityConditionParser)
      .parse(condition)

    if (!isEmpty(ExpressionAttributeNames)) {
      commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    }

    if (!isEmpty(ExpressionAttributeValues)) {
      commandOptions.ExpressionAttributeValues = ExpressionAttributeValues
    }

    commandOptions.ConditionExpression = ConditionExpression
  }

  if (tableName !== undefined) {
    // tableName is a meta-option, validated but not used here
    parseTableNameOption(tableName)
  }

  return commandOptions
}
