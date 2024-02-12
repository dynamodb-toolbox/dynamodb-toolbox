import type { EntityV2 } from 'v1/entity'
import type { Schema } from 'v1/schema'
import type { AnyAttributePath } from 'v1/operations/types'

import { ProjectionParser } from './parser'

export const parseSchemaProjection = <
  SCHEMA extends Schema,
  ATTRIBUTE_PATHS extends AnyAttributePath<SCHEMA>[]
>(
  schema: SCHEMA,
  attributes: ATTRIBUTE_PATHS,
  id?: string
): {
  ProjectionExpression: string
  ExpressionAttributeNames: Record<string, string>
} => {
  const projectionExpression = new ProjectionParser(schema, id)
  projectionExpression.parseProjection(attributes)
  return projectionExpression.toCommandOptions()
}

export const parseProjection = <
  ENTITY extends EntityV2,
  ATTRIBUTE_PATHS extends AnyAttributePath<ENTITY['schema']>[]
>(
  entity: ENTITY,
  attributes: ATTRIBUTE_PATHS,
  id?: string
) => parseSchemaProjection(entity.schema, attributes, id)
