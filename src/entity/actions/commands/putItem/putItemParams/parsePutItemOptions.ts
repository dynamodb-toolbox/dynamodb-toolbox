import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { isEmpty } from 'lodash'

import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseMetricsOption } from '~/options/metrics.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseReturnValuesOption } from '~/options/returnValues.js'

import { putItemCommandReturnValuesOptionsSet } from '../options.js'
import type { PutItemOptions } from '../options.js'

type CommandOptions = Omit<PutCommandInput, 'TableName' | 'Item'>

export const parsePutItemOptions = <ENTITY extends Entity>(
  entity: ENTITY,
  putItemOptions: PutItemOptions<ENTITY>
): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, metrics, returnValues, condition, ...extraOptions } = putItemOptions
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

  return commandOptions
}
