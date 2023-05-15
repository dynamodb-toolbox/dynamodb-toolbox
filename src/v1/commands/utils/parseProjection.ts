import type { Item } from 'v1/item'
import type { AnyAttributePath } from 'v1/commands/types/paths'
import { ProjectionParser } from 'v1/commands/classes/projectionParser'

export const parseProjection = <
  ITEM extends Item,
  ATTRIBUTE_PATHS extends AnyAttributePath<ITEM>[]
>(
  item: ITEM,
  attributes: ATTRIBUTE_PATHS
): {
  ProjectionExpression: string
  ExpressionAttributeNames: Record<string, string>
} => {
  const projectionExpression = new ProjectionParser(item)
  projectionExpression.parseProjection(attributes)
  return projectionExpression.toCommandOptions()
}
