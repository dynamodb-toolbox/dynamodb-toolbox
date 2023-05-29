import type { Schema } from 'v1/schema'
import type { AnyAttributePath } from 'v1/commands/types/paths'
import { ProjectionParser } from 'v1/commands/classes/projectionParser'

export const parseProjection = <
  SCHEMA extends Schema,
  ATTRIBUTE_PATHS extends AnyAttributePath<SCHEMA>[]
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
