import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'
import { isEmpty } from 'lodash'

import { EntityPathParser } from '~/entity/actions/parsePaths.js'
import type { Entity } from '~/entity/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseConsistentOption } from '~/options/consistent.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import type { GetItemOptions } from '../options.js'

type CommandOptions = Omit<GetCommandInput, 'TableName' | 'Key'>

type GetItemOptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  getItemOptions: GetItemOptions<ENTITY>
) => CommandOptions

export const parseGetItemOptions: GetItemOptionsParser = (entity, getItemOptions) => {
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
