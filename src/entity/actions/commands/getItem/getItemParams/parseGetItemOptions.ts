import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'
import { isEmpty } from 'lodash'

import type { EntityV2 } from '~/entity/index.js'
import { EntityPathParser } from '~/entity/actions/parsePaths.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseConsistentOption } from '~/options/consistent.js'

import type { GetItemOptions } from '../options.js'

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
