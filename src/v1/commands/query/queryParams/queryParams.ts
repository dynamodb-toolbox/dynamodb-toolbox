import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import isEmpty from 'lodash.isempty'

import type { TableV2 } from 'v1/table'
import type { AnyAttributePath, Condition } from 'v1/commands/types'
import type { EntityV2 } from 'v1/entity'
import { DynamoDBToolboxError } from 'v1/errors'
import { parseCapacityOption } from 'v1/commands/utils/parseOptions/parseCapacityOption'
import { parseIndexNameOption } from 'v1/commands/utils/parseOptions/parseIndexNameOption'
import { parseConsistentOption } from 'v1/commands/utils/parseOptions/parseConsistentOption'
import { parseLimitOption } from 'v1/commands/utils/parseOptions/parseLimitOption'
import { parseSelectOption } from 'v1/commands/utils/parseOptions/parseSelectOption'
import { rejectExtraOptions } from 'v1/commands/utils/parseOptions/rejectExtraOptions'
import { parseCondition } from 'v1/commands/expression/condition/parse'
import { parseProjection } from 'v1/commands/expression/projection/parse'

import type { QueryOptions } from '../options'
import { isBoolean } from 'v1/utils/validation'

export const queryParams = <
  TABLE extends TableV2,
  ENTITIES extends EntityV2,
  OPTIONS extends QueryOptions<TABLE, ENTITIES>
>(
  { table, entities = [] }: { table: TABLE; entities?: ENTITIES[] },
  scanOptions: OPTIONS = {} as OPTIONS
): QueryCommandInput => {
  const {
    capacity,
    consistent,
    exclusiveStartKey,
    indexName,
    limit,
    reverse,
    select,
    filters: _filters,
    attributes: _attributes,
    ...extraOptions
  } = scanOptions

  const filters = (_filters ?? {}) as Record<string, Condition>
  const attributes = _attributes as AnyAttributePath[] | undefined

  const commandOptions: QueryCommandInput = {
    TableName: table.getName()
  }

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (consistent !== undefined) {
    commandOptions.ConsistentRead = parseConsistentOption(consistent, indexName)
  }

  if (exclusiveStartKey !== undefined) {
    commandOptions.ExclusiveStartKey = exclusiveStartKey
  }

  if (indexName !== undefined) {
    commandOptions.IndexName = parseIndexNameOption(table, indexName)
  }

  if (limit !== undefined) {
    commandOptions.Limit = parseLimitOption(limit)
  }

  if (reverse !== undefined) {
    if (!isBoolean(reverse)) {
      throw new DynamoDBToolboxError('queryCommand.invalidReverseOption', {
        message: 'Invalid "reverse" options: Must be a boolean',
        payload: { reverse }
      })
    }

    commandOptions.ScanIndexForward = !reverse
  }

  if (select !== undefined) {
    commandOptions.Select = parseSelectOption(select, { indexName, attributes })
  }

  if (entities.length > 0) {
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}
    const filterExpressions: string[] = []
    let projectionExpression: string | undefined = undefined

    entities.forEach((entity, index) => {
      const entityNameFilter = { attr: entity.entityAttributeName, eq: entity.name }
      const entityFilter = filters[entity.name]

      const {
        ExpressionAttributeNames: filterExpressionAttributeNames,
        ExpressionAttributeValues: filterExpressionAttributeValues,
        ConditionExpression: filterExpression
      } = parseCondition<EntityV2, Condition<EntityV2>>(
        entity,
        entityFilter !== undefined ? { and: [entityNameFilter, entityFilter] } : entityNameFilter,
        index.toString()
      )

      Object.assign(expressionAttributeNames, filterExpressionAttributeNames)
      Object.assign(expressionAttributeValues, filterExpressionAttributeValues)
      filterExpressions.push(filterExpression)

      // TODO: For now, we compute the projectionExpression using the first entity. Will probably use Table schemas once they exist.
      if (projectionExpression === undefined && attributes !== undefined) {
        const {
          ExpressionAttributeNames: projectionExpressionAttributeNames,
          ProjectionExpression
        } = parseProjection<EntityV2, AnyAttributePath[]>(entity, attributes)

        Object.assign(expressionAttributeNames, projectionExpressionAttributeNames)
        projectionExpression = ProjectionExpression
      }
    })

    if (!isEmpty(expressionAttributeNames)) {
      commandOptions.ExpressionAttributeNames = expressionAttributeNames
    }

    if (!isEmpty(expressionAttributeValues)) {
      commandOptions.ExpressionAttributeValues = expressionAttributeValues
    }

    if (filterExpressions.length > 0) {
      commandOptions.FilterExpression =
        filterExpressions.length === 1
          ? filterExpressions[0]
          : `(${filterExpressions.filter(Boolean).join(') OR (')})`
    }

    if (projectionExpression !== undefined) {
      commandOptions.ProjectionExpression = projectionExpression
    }
  }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
