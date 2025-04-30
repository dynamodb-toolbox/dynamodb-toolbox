import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityConditionParser } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseMetricsOption } from '~/options/metrics.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseReturnValuesOption } from '~/options/returnValues.js'
import { parseReturnValuesOnConditionFalseOption } from '~/options/returnValuesOnConditionFalse.js'
import { parseTableNameOption } from '~/options/tableName.js'
import { isEmpty } from '~/utils/isEmpty.js'

import { putItemCommandReturnValuesOptionsSet } from '../options.js'
import type { PutItemOptions } from '../options.js'

type CommandOptions = Omit<PutCommandInput, 'TableName' | 'Item'>

type PutItemOptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  putItemOptions: PutItemOptions<ENTITY>
) => CommandOptions

export const parsePutItemOptions: PutItemOptionsParser = (entity, putItemOptions) => {
  const commandOptions: CommandOptions = {}

  const {
    capacity,
    metrics,
    returnValues,
    returnValuesOnConditionFalse,
    condition,
    tableName,
    ...extraOptions
  } = putItemOptions
  rejectExtraOptions(extraOptions)

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (metrics !== undefined) {
    commandOptions.ReturnItemCollectionMetrics = parseMetricsOption(metrics)
  }

  if (returnValues !== undefined) {
    commandOptions.ReturnValues = parseReturnValuesOption(
      putItemCommandReturnValuesOptionsSet,
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
