import type { GetCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityPathParser } from '~/entity/actions/parsePaths/index.js'
import type { Entity } from '~/entity/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseConsistentOption } from '~/options/consistent.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseTableNameOption } from '~/options/tableName.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { GetItemOptions } from '../options.js'

type CommandOptions = Omit<GetCommandInput, 'TableName' | 'Key'>

type GetItemOptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  getItemOptions: GetItemOptions<ENTITY>
) => CommandOptions

export const parseGetItemOptions: GetItemOptionsParser = (entity, getItemOptions) => {
  const commandOptions: CommandOptions = {}

  const { capacity, consistent, attributes, tableName, ...extraOptions } = getItemOptions
  rejectExtraOptions(extraOptions)

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

    if (!isEmpty(ExpressionAttributeNames)) {
      commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    }

    commandOptions.ProjectionExpression = ProjectionExpression
  }

  if (tableName !== undefined) {
    // tableName is a meta-option, validated but not used here
    parseTableNameOption(tableName)
  }

  return commandOptions
}
