import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import isEmpty from 'lodash.isempty'

import type { TableV2 } from 'v1/table'
import type { AnyAttributePath, Condition, Query } from 'v1/operations/types'
import type { EntityV2 } from 'v1/entity'
import { DynamoDBToolboxError } from 'v1/errors'
import { parseCapacityOption } from 'v1/operations/utils/parseOptions/parseCapacityOption'
import { parseIndexOption } from 'v1/operations/utils/parseOptions/parseIndexOption'
import { parseConsistentOption } from 'v1/operations/utils/parseOptions/parseConsistentOption'
import { parseLimitOption } from 'v1/operations/utils/parseOptions/parseLimitOption'
import { parseMaxPagesOption } from 'v1/operations/utils/parseOptions/parseMaxPagesOption'
import { parseSelectOption } from 'v1/operations/utils/parseOptions/parseSelectOption'
import { rejectExtraOptions } from 'v1/operations/utils/parseOptions/rejectExtraOptions'
import { parseCondition } from 'v1/operations/expression/condition/parse'
import { parseProjection } from 'v1/operations/expression/projection/parse'

import type { QueryOptions } from '../options'
import { isBoolean } from 'v1/utils/validation'
import { parseQuery } from './parseQuery'

export const queryParams = <
  TABLE extends TableV2,
  ENTITIES extends EntityV2[],
  QUERY extends Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>
>(
  { table, entities = ([] as unknown) as ENTITIES }: { table: TABLE; entities?: ENTITIES },
  query: QUERY,
  scanOptions: OPTIONS = {} as OPTIONS
): QueryCommandInput => {
  const { index } = query
  const {
    capacity,
    consistent,
    exclusiveStartKey,
    limit,
    maxPages,
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
    commandOptions.ConsistentRead = parseConsistentOption(consistent, index)
  }

  if (exclusiveStartKey !== undefined) {
    commandOptions.ExclusiveStartKey = exclusiveStartKey
  }

  if (index !== undefined) {
    commandOptions.IndexName = parseIndexOption(table, index)
  }

  if (limit !== undefined) {
    commandOptions.Limit = parseLimitOption(limit)
  }

  if (maxPages !== undefined) {
    // maxPages is a meta-option, validated but not used here
    parseMaxPagesOption(maxPages)
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
    commandOptions.Select = parseSelectOption(select, { index, attributes })
  }

  const expressionAttributeNames: Record<string, string> = {}
  const expressionAttributeValues: Record<string, any> = {}

  const {
    KeyConditionExpression,
    ExpressionAttributeNames: keyConditionExpressionAttributeNames,
    ExpressionAttributeValues: keyConditionExpressionAttributeValues
  } = parseQuery(table, query)

  commandOptions.KeyConditionExpression = KeyConditionExpression
  Object.assign(expressionAttributeNames, keyConditionExpressionAttributeNames)
  Object.assign(expressionAttributeValues, keyConditionExpressionAttributeValues)

  if (entities.length > 0) {
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
        // Need to add +1 to take KeyConditionExpression into account
        (index + 1).toString()
      )

      Object.assign(expressionAttributeNames, filterExpressionAttributeNames)
      Object.assign(expressionAttributeValues, filterExpressionAttributeValues)
      filterExpressions.push(filterExpression)

      // TODO: For now, we compute the projectionExpression using the first entity. Will probably use Table schemas once they exist.
      if (projectionExpression === undefined && attributes !== undefined) {
        const {
          ExpressionAttributeNames: projectionExpressionAttributeNames,
          ProjectionExpression
        } = parseProjection<EntityV2, AnyAttributePath[]>(entity, [
          // entityAttributeName is required at all times for formatting
          ...(attributes.includes(entity.entityAttributeName) ? [] : [entity.entityAttributeName]),
          ...attributes
        ])

        Object.assign(expressionAttributeNames, projectionExpressionAttributeNames)
        projectionExpression = ProjectionExpression
      }
    })

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

  if (!isEmpty(expressionAttributeNames)) {
    commandOptions.ExpressionAttributeNames = expressionAttributeNames
  }

  if (!isEmpty(expressionAttributeValues)) {
    commandOptions.ExpressionAttributeValues = expressionAttributeValues
  }

  rejectExtraOptions(extraOptions)

  return commandOptions
}
