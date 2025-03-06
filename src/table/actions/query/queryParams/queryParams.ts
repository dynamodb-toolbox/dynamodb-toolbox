import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb'

import type { Condition } from '~/entity/actions/parseCondition/index.js'
import { EntityConditionParser } from '~/entity/actions/parseCondition/index.js'
import type { EntityPaths } from '~/entity/actions/parsePaths/index.js'
import { EntityPathParser } from '~/entity/actions/parsePaths/index.js'
import type { Entity } from '~/entity/index.js'
import { getEntityAttrOptionValue, isEntityAttrEnabled } from '~/entity/utils/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseConsistentOption } from '~/options/consistent.js'
import { parseEntityAttrFilterOption } from '~/options/entityAttrFilter.js'
import { parseIndexOption } from '~/options/index.js'
import { parseLimitOption } from '~/options/limit.js'
import { parseMaxPagesOption } from '~/options/maxPages.js'
import { parseNoEntityMatchBehavior } from '~/options/noEntityMatchBehavior.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseSelectOption } from '~/options/select.js'
import { parseShowEntityAttrOption } from '~/options/showEntityAttr.js'
import { parseTableNameOption } from '~/options/tableName.js'
import { ConditionParser } from '~/schema/actions/parseCondition/index.js'
import { AnySchema } from '~/schema/any/schema.js'
import type { Table } from '~/table/index.js'
import { isEmpty } from '~/utils/isEmpty.js'
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
  options?: OPTIONS
) => QueryCommandInput

const defaultAnySchema = new AnySchema({ required: 'never' })

export const queryParams: QueryParamsGetter = <
  TABLE extends Table,
  ENTITIES extends Entity[],
  QUERY extends Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>
>(
  table: TABLE,
  entities = [] as unknown as ENTITIES,
  query: QUERY,
  options: OPTIONS = {} as OPTIONS
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
    filter,
    filters: _filters,
    attributes: _attributes,
    tableName,
    entityAttrFilter = entities.every(entity => isEntityAttrEnabled(entity.entityAttribute)),
    showEntityAttr,
    noEntityMatchBehavior,
    ...extraOptions
  } = options
  rejectExtraOptions(extraOptions)

  const filters = (_filters ?? {}) as Record<string, Condition>
  const attributes = _attributes as EntityPaths[] | undefined

  if (tableName !== undefined) {
    parseTableNameOption(tableName)
  }

  const commandOptions: QueryCommandInput = {
    TableName: tableName ?? table.getName()
  }

  if (capacity !== undefined) {
    commandOptions.ReturnConsumedCapacity = parseCapacityOption(capacity)
  }

  if (index !== undefined) {
    commandOptions.IndexName = parseIndexOption(table, index)
  }

  if (consistent !== undefined) {
    commandOptions.ConsistentRead = parseConsistentOption(
      consistent,
      index !== undefined ? table.indexes[index] : undefined
    )
  }

  if (exclusiveStartKey !== undefined) {
    commandOptions.ExclusiveStartKey = exclusiveStartKey
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

  // entityAttrFilter is a meta-option, validated but not used here
  parseEntityAttrFilterOption(entityAttrFilter, entities, filters)

  if (showEntityAttr !== undefined) {
    // showEntityAttr is a meta-option, validated but not used here
    parseShowEntityAttrOption(showEntityAttr)
  }

  if (noEntityMatchBehavior !== undefined) {
    // noEntityMatchBehavior is a meta-option, validated but not used here
    parseNoEntityMatchBehavior(noEntityMatchBehavior)
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

  if (entities.length === 0 && filter !== undefined) {
    const {
      ExpressionAttributeNames: filterExpressionAttributeNames,
      ExpressionAttributeValues: filterExpressionAttributeValues,
      ConditionExpression: filterExpression
    } = new ConditionParser(defaultAnySchema).setId('1').parse(filter).toCommandOptions()

    Object.assign(expressionAttributeNames, filterExpressionAttributeNames)
    Object.assign(expressionAttributeValues, filterExpressionAttributeValues)
    commandOptions.FilterExpression = filterExpression
  }

  if (entities.length > 0) {
    const filterExpressions: string[] = []
    let projectionExpression: string | undefined = undefined

    let index = 0
    for (const entity of entities) {
      /**
       * @debt feature "For now, we compute the projectionExpression using the first entity. Will probably use Table schemas once they exist."
       */
      if (projectionExpression === undefined && attributes !== undefined) {
        const {
          ExpressionAttributeNames: projectionExpressionAttributeNames,
          ProjectionExpression
        } = entity.build(EntityPathParser).parse(attributes).toCommandOptions()

        Object.assign(expressionAttributeNames, projectionExpressionAttributeNames)
        projectionExpression = ProjectionExpression

        const { entityAttributeSavedAs } = table

        // We prefer including the entityAttrSavedAs for faster formatting
        if (!Object.values(expressionAttributeNames).includes(entityAttributeSavedAs)) {
          projectionExpression += `, #_et`
          expressionAttributeNames['#_et'] = entityAttributeSavedAs
        }
      }

      const entityOptionsFilter = filters[entity.entityName]
      const entityNameFilter = entityAttrFilter
        ? // NOTE: We validated that all entities have entityAttr enabled
          { attr: getEntityAttrOptionValue(entity.entityAttribute, 'name'), eq: entity.entityName }
        : undefined

      if (entityOptionsFilter === undefined && entityNameFilter === undefined) {
        continue
      }

      const entityFilters = [entityNameFilter, entityOptionsFilter].filter(Boolean) as Condition[]

      const {
        ExpressionAttributeNames: filterExpressionAttributeNames,
        ExpressionAttributeValues: filterExpressionAttributeValues,
        ConditionExpression: filterExpression
      } = entity
        .build(EntityConditionParser)
        // Need to add +1 to take KeyConditionExpression into account
        .setId((index + 1).toString())
        .parse({ and: entityFilters })
        .toCommandOptions()

      Object.assign(expressionAttributeNames, filterExpressionAttributeNames)
      Object.assign(expressionAttributeValues, filterExpressionAttributeValues)
      filterExpressions.push(filterExpression)

      index++
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

  if (!isEmpty(expressionAttributeNames)) {
    commandOptions.ExpressionAttributeNames = expressionAttributeNames
  }

  if (!isEmpty(expressionAttributeValues)) {
    commandOptions.ExpressionAttributeValues = expressionAttributeValues
  }

  return commandOptions
}
