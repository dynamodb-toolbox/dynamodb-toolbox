import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { isEmpty } from 'lodash'

import { isBoolean } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'
import type { TableV2 } from 'v1/table'
import type { EntityV2 } from 'v1/entity'
import { EntityPathParser, EntityPaths } from 'v1/entity/actions/parsePaths'
import { EntityConditionParser, EntityCondition } from 'v1/entity/actions/parseCondition'

import { parseCapacityOption } from 'v1/options/capacity'
import { parseIndexOption } from 'v1/options/index'
import { parseConsistentOption } from 'v1/options/consistent'
import { parseLimitOption } from 'v1/options/limit'
import { parseMaxPagesOption } from 'v1/options/maxPages'
import { parseSelectOption } from 'v1/options/select'
import { rejectExtraOptions } from 'v1/options/rejectExtraOptions'

import type { Query } from '../types'
import type { QueryOptions } from '../options'
import { parseQuery } from './parseQuery'

export const queryParams = <
  TABLE extends TableV2,
  ENTITIES extends EntityV2[],
  QUERY extends Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>
>(
  table: TABLE,
  entities = ([] as unknown) as ENTITIES,
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

  const filters = (_filters ?? {}) as Record<string, EntityCondition>
  const attributes = _attributes as EntityPaths[] | undefined

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
      } = entity
        .build(EntityConditionParser)
        // Need to add +1 to take KeyConditionExpression into account
        .setId((index + 1).toString())
        .parse(
          entityFilter !== undefined ? { and: [entityNameFilter, entityFilter] } : entityNameFilter
        )
        .toCommandOptions()

      Object.assign(expressionAttributeNames, filterExpressionAttributeNames)
      Object.assign(expressionAttributeValues, filterExpressionAttributeValues)
      filterExpressions.push(filterExpression)

      // TODO: For now, we compute the projectionExpression using the first entity. Will probably use Table schemas once they exist.
      if (projectionExpression === undefined && attributes !== undefined) {
        const { entityAttributeName } = entity

        const {
          ExpressionAttributeNames: projectionExpressionAttributeNames,
          ProjectionExpression
        } = entity
          .build(EntityPathParser)
          .parse(
            // entityAttributeName is required at all times for formatting
            attributes.includes(entityAttributeName)
              ? attributes
              : [entityAttributeName, ...attributes]
          )
          .toCommandOptions()

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
