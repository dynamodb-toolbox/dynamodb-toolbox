import type { ScanCommandInput } from '@aws-sdk/lib-dynamodb'

import { AnyAttribute } from '~/attributes/any/index.js'
import { EntityConditionParser } from '~/entity/actions/parseCondition/index.js'
import type { Condition } from '~/entity/actions/parseCondition/index.js'
import { EntityPathParser } from '~/entity/actions/parsePaths/index.js'
import type { EntityPaths } from '~/entity/actions/parsePaths/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseConsistentOption } from '~/options/consistent.js'
import { parseIndexOption } from '~/options/index.js'
import { parseLimitOption } from '~/options/limit.js'
import { parseMaxPagesOption } from '~/options/maxPages.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseSelectOption } from '~/options/select.js'
import { parseTableNameOption } from '~/options/tableName.js'
import { ConditionParser } from '~/schema/actions/parseCondition/index.js'
import type { Table } from '~/table/index.js'
import { isEmpty } from '~/utils/isEmpty.js'
import { isInteger } from '~/utils/validation/isInteger.js'

import type { ScanOptions } from '../options.js'

type ScanParamsGetter = <
  TABLE extends Table,
  ENTITIES extends Entity[],
  OPTIONS extends ScanOptions<TABLE, ENTITIES>
>(
  table: TABLE,
  entities?: ENTITIES,
  options?: OPTIONS
) => ScanCommandInput

const defaultAnyAttribute = new AnyAttribute({
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  defaults: { key: undefined, put: undefined, update: undefined },
  links: { key: undefined, put: undefined, update: undefined },
  validators: { key: undefined, put: undefined, update: undefined },
  castAs: undefined
})

export const scanParams: ScanParamsGetter = <
  TABLE extends Table,
  ENTITIES extends Entity[],
  OPTIONS extends ScanOptions<TABLE, ENTITIES>
>(
  table: TABLE,
  entities = [] as unknown as ENTITIES,
  options: OPTIONS = {} as OPTIONS
) => {
  const {
    capacity,
    consistent,
    exclusiveStartKey,
    index,
    limit,
    maxPages,
    select,
    totalSegments,
    segment,
    entityAttrFilter = true,
    filter,
    filters: _filters,
    attributes: _attributes,
    tableName,
    ...extraOptions
  } = options
  rejectExtraOptions(extraOptions)

  const filters = (_filters ?? {}) as Record<string, Condition>
  const attributes = _attributes as EntityPaths[] | undefined

  if (tableName !== undefined) {
    parseTableNameOption(tableName)
  }

  const commandOptions: ScanCommandInput = {
    TableName: tableName ?? table.getName()
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

  if (select !== undefined) {
    commandOptions.Select = parseSelectOption(select, { index, attributes })
  }

  if (segment !== undefined) {
    if (totalSegments === undefined) {
      throw new DynamoDBToolboxError('scanCommand.invalidSegmentOption', {
        message: 'If a segment option has been provided, totalSegments must also be defined',
        payload: {}
      })
    }

    if (!isInteger(totalSegments) || totalSegments < 1) {
      throw new DynamoDBToolboxError('scanCommand.invalidSegmentOption', {
        message: `Invalid totalSegments option: '${String(
          totalSegments
        )}'. 'totalSegments' must be a strictly positive integer.`,
        payload: { totalSegments }
      })
    }

    if (!isInteger(segment) || segment < 0 || segment >= totalSegments) {
      throw new DynamoDBToolboxError('scanCommand.invalidSegmentOption', {
        message: `Invalid segment option: '${String(
          segment
        )}'. 'segment' must be a positive integer strictly lower than 'totalSegments'.`,
        payload: { segment, totalSegments }
      })
    }

    commandOptions.TotalSegments = totalSegments
    commandOptions.Segment = segment
  }

  const expressionAttributeNames: Record<string, string> = {}
  const expressionAttributeValues: Record<string, any> = {}

  if (entities.length === 0 && filter !== undefined) {
    const {
      ExpressionAttributeNames: filterExpressionAttributeNames,
      ExpressionAttributeValues: filterExpressionAttributeValues,
      ConditionExpression: filterExpression
    } = new ConditionParser(defaultAnyAttribute).parse(filter).toCommandOptions()

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

      const entityFilter = filters[entity.name]
      if (entityFilter === undefined && !entityAttrFilter) {
        continue
      }

      const entityNameFilter = { attr: entity.entityAttributeName, eq: entity.name }

      const {
        ExpressionAttributeNames: filterExpressionAttributeNames,
        ExpressionAttributeValues: filterExpressionAttributeValues,
        ConditionExpression: filterExpression
      } = entity
        .build(EntityConditionParser)
        .setId(index.toString())
        .parse(
          entityFilter !== undefined ? { and: [entityNameFilter, entityFilter] } : entityNameFilter
        )
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
