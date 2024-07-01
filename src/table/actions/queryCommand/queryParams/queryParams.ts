import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { isEmpty } from 'lodash'

import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { Condition } from '~/entity/actions/parseCondition.js'
import { EntityPathParser } from '~/entity/actions/parsePaths.js'
import type { EntityPaths } from '~/entity/actions/parsePaths.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseConsistentOption } from '~/options/consistent.js'
import { parseIndexOption } from '~/options/index.js'
import { parseLimitOption } from '~/options/limit.js'
import { parseMaxPagesOption } from '~/options/maxPages.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseSelectOption } from '~/options/select.js'
import type { Table } from '~/table/index.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'

import type { QueryOptions } from '../options.js'
import type { Query } from '../types.js'
import { parseQuery } from './parseQuery.js'

type QueryParamsGetter = <
  TABLE extends Table,
  ENTITIES extends Entity[],
  QUERY extends Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>
>(
  table: TABLE,
  entities: ENTITIES,
  query: QUERY,
  scanOptions?: OPTIONS
) => QueryCommandInput

export const queryParams: QueryParamsGetter = <
  TABLE extends Table,
  ENTITIES extends Entity[],
  QUERY extends Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>
>(
  table: TABLE,
  entities = [] as unknown as ENTITIES,
  query: QUERY,
  scanOptions: OPTIONS = {} as OPTIONS
) => {
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
      if (attributes !== undefined) {
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
