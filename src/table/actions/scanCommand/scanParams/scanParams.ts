import type { ScanCommandInput } from '@aws-sdk/lib-dynamodb'
import { isEmpty } from 'lodash'

import { Condition, EntityConditionParser } from '~/entity/actions/parseCondition.js'
import { EntityPathParser, EntityPaths } from '~/entity/actions/parsePaths.js'
import type { EntityV2 } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseCapacityOption } from '~/options/capacity.js'
import { parseConsistentOption } from '~/options/consistent.js'
import { parseIndexOption } from '~/options/index.js'
import { parseLimitOption } from '~/options/limit.js'
import { parseMaxPagesOption } from '~/options/maxPages.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseSelectOption } from '~/options/select.js'
import type { TableV2 } from '~/table/index.js'
import { isInteger } from '~/utils/validation/isInteger.js'

import type { ScanOptions } from '../options.js'

export const scanParams = <
  TABLE extends TableV2,
  ENTITIES extends EntityV2[],
  OPTIONS extends ScanOptions<TABLE, ENTITIES>
>(
  table: TABLE,
  entities = [] as unknown as ENTITIES,
  scanOptions: OPTIONS = {} as OPTIONS
): ScanCommandInput => {
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
    filters: _filters,
    attributes: _attributes,
    ...extraOptions
  } = scanOptions

  const filters = (_filters ?? {}) as Record<string, Condition>
  const attributes = _attributes as EntityPaths[] | undefined

  const commandOptions: ScanCommandInput = {
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
