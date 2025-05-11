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
import { expressCondition } from '~/schema/actions/parseCondition/expressCondition/expressCondition.js'
import { ConditionParser } from '~/schema/actions/parseCondition/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
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
    tagEntities,
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

  if (tagEntities !== undefined) {
    // tagEntities is a meta-option, validated but not used here
    if (!isBoolean(tagEntities)) {
      throw new DynamoDBToolboxError('queryCommand.invalidTagEntitiesOption', {
        message: `Invalid 'tagEntities' option: '${String(
          tagEntities
        )}'. 'tagEntities' must be a boolean.`,
        payload: { tagEntities }
      })
    }
  }

  if (noEntityMatchBehavior !== undefined) {
    // noEntityMatchBehavior is a meta-option, validated but not used here
    parseNoEntityMatchBehavior(noEntityMatchBehavior)
  }

  const expressionAttributeNames: Record<string, string> = {}
  const expressionAttributeValues: Record<string, any> = {}

  // --- PROJECTION ---
  if (attributes !== undefined && attributes.length > 0) {
    if (entities.length === 0) {
      // TODO: Handle projections even without entities
    } else {
      const transformedPaths = new Deduper<string>({ serializer: value => value })

      for (const entity of entities) {
        const entityTransformedPaths = entity
          .build(EntityPathParser)
          .transform(attributes, { strict: false })

        if (entityTransformedPaths.length === 0) {
          throw new DynamoDBToolboxError('queryCommand.invalidProjectionExpression', {
            message: `Unable to match any expression attribute path with entity: ${entity.entityName}`,
            payload: { entity: entity.entityName }
          })
        }

        for (const transformedPath of entityTransformedPaths) {
          transformedPaths.push(transformedPath)
        }
      }

      const expression = EntityPathParser.express(transformedPaths.values)
      Object.assign(expressionAttributeNames, expression.ExpressionAttributeNames)

      // include the entityAttrSavedAs for faster formatting
      const { entityAttributeSavedAs } = table
      if (!Object.values(expression.ExpressionAttributeNames).includes(entityAttributeSavedAs)) {
        commandOptions.ProjectionExpression = [expression.ProjectionExpression, '#_et'].join(', ')
        expressionAttributeNames['#_et'] = entityAttributeSavedAs
      } else {
        commandOptions.ProjectionExpression = expression.ProjectionExpression
      }
    }
  }

  // --- KEY CONDITION ---
  const {
    KeyConditionExpression,
    ExpressionAttributeNames: keyConditionExpressionAttributeNames,
    ExpressionAttributeValues: keyConditionExpressionAttributeValues
  } = parseQuery(table, query)

  commandOptions.KeyConditionExpression = KeyConditionExpression
  Object.assign(expressionAttributeNames, keyConditionExpressionAttributeNames)
  Object.assign(expressionAttributeValues, keyConditionExpressionAttributeValues)

  // --- FILTERS ---
  if (entities.length === 0 && filter !== undefined) {
    const expression = new ConditionParser(defaultAnySchema).parse(filter, {
      // Distinguish from KeyConditionExpression
      expressionId: '1'
    })

    Object.assign(expressionAttributeNames, expression.ExpressionAttributeNames)
    Object.assign(expressionAttributeValues, expression.ExpressionAttributeValues)
    commandOptions.FilterExpression = expression.ConditionExpression
  }

  if (entities.length > 0) {
    const transformedFilters: Condition[] = []

    for (const entity of entities) {
      const entityOptionsFilter = filters[entity.entityName]
      const entityNameFilter = entityAttrFilter
        ? // NOTE: We validated that all entities have entityAttr enabled
          {
            attr: getEntityAttrOptionValue(entity.entityAttribute, 'name'),
            eq: entity.entityName
          }
        : undefined

      if (entityOptionsFilter === undefined && entityNameFilter === undefined) {
        continue
      }

      const transformedFilter = entity.build(EntityConditionParser).transform({
        and: [entityNameFilter, entityOptionsFilter].filter(Boolean) as Condition[]
      })

      transformedFilters.push(transformedFilter)
    }

    if (transformedFilters.length > 0) {
      // Prefix w. '1' to distinguish from KeyConditionExpression
      const expression = expressCondition({ or: transformedFilters }, '1')

      Object.assign(expressionAttributeNames, expression.ExpressionAttributeNames)
      Object.assign(expressionAttributeValues, expression.ExpressionAttributeValues)
      commandOptions.FilterExpression = expression.ConditionExpression
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
