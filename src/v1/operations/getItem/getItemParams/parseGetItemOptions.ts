import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'
import isEmpty from 'lodash.isempty'

import type { EntityV2 } from 'v1/entity'
import { parseCapacityOption } from 'v1/operations/utils/parseOptions/parseCapacityOption'
import { rejectExtraOptions } from 'v1/operations/utils/parseOptions/rejectExtraOptions'
import { parseConsistentOption } from 'v1/operations/utils/parseOptions/parseConsistentOption'
import { parseProjection } from 'v1/operations/expression/projection/parse'

import type { GetItemOptions } from '../options'

type CommandOptions = Omit<GetCommandInput, 'TableName' | 'Key'>

export const parseGetItemOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  getItemOptions: GetItemOptions<ENTITY>
): CommandOptions => {
  const commandOptions: CommandOptions = {}

  const { capacity, consistent, attributes, ...extraOptions } = getItemOptions

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (consistent !== undefined) {
    commandOptions.ConsistentRead = parseConsistentOption(consistent)
  }

  if (attributes !== undefined) {
    const { ExpressionAttributeNames, ProjectionExpression } = parseProjection(entity, attributes)

    if (!isEmpty(ExpressionAttributeNames)) {
      commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    }

    commandOptions.ProjectionExpression = ProjectionExpression
  }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
