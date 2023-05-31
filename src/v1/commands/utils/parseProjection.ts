import type { EntityV2 } from 'v1/entity'
import type { Schema } from 'v1/schema'
import type { SchemaAttributePath, AnyAttributePath } from 'v1/commands/types/paths'
import { ProjectionParser } from 'v1/commands/classes/projectionParser'

export const parseSchemaProjection = <
  SCHEMA extends Schema,
  ATTRIBUTE_PATHS extends SchemaAttributePath<SCHEMA>[]
>(
  schema: SCHEMA,
  attributes: ATTRIBUTE_PATHS
): {
  ProjectionExpression: string
  ExpressionAttributeNames: Record<string, string>
} => {
  const projectionExpression = new ProjectionParser(schema)
  projectionExpression.parseProjection(attributes)
  return projectionExpression.toCommandOptions()
}

export const parseProjection = <
  ENTITY extends EntityV2,
  ATTRIBUTE_PATHS extends AnyAttributePath<ENTITY>[]
>(
  entity: ENTITY,
  attributes: ATTRIBUTE_PATHS
) => parseSchemaProjection(entity.schema, attributes)
