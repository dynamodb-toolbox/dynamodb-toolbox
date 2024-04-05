import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'
import isEmpty from 'lodash.isempty'

import type { EntityV2 } from 'v1/entity'
import { EntityPathParser } from 'v1/entity/actions/parsePaths'
import { parseCapacityOption } from 'v1/operations/utils/parseOptions/parseCapacityOption'
import { rejectExtraOptions } from 'v1/operations/utils/parseOptions/rejectExtraOptions'
import { parseConsistentOption } from 'v1/operations/utils/parseOptions/parseConsistentOption'

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
    const { ExpressionAttributeNames, ProjectionExpression } = entity
      .build(EntityPathParser)
      .parse(attributes)
      .toCommandOptions()

    if (!isEmpty(ExpressionAttributeNames)) {
      commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    }

    commandOptions.ProjectionExpression = ProjectionExpression
  }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
