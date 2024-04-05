import type { DeleteCommandInput } from '@aws-sdk/lib-dynamodb'
import isEmpty from 'lodash.isempty'

import type { EntityV2 } from 'v1/entity'
import { EntityConditionParser } from 'v1/entity/actions/parseCondition'
import { parseCapacityOption } from 'v1/operations/utils/parseOptions/parseCapacityOption'
import { parseMetricsOption } from 'v1/operations/utils/parseOptions/parseMetricsOption'
import { parseReturnValuesOption } from 'v1/operations/utils/parseOptions/parseReturnValuesOption'
import { rejectExtraOptions } from 'v1/operations/utils/parseOptions/rejectExtraOptions'

import { deleteItemCommandReturnValuesOptionsSet, DeleteItemOptions } from '../options'

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
