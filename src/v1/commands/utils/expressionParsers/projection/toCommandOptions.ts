import type { ProjectionParser } from './projectionParser'

export const toCommandOptions = (
  projectionParser: ProjectionParser
): {
  ProjectionExpression: string
  ExpressionAttributeNames: Record<string, string>
} => {
  const ExpressionAttributeNames: Record<string, string> = {}

  projectionParser.expressionAttributeNames.forEach((expressionAttributeName, index) => {
    ExpressionAttributeNames[`#${index + 1}`] = expressionAttributeName
  })

  const ProjectionExpression = projectionParser.expression

  return {
    ExpressionAttributeNames,
    ProjectionExpression
  }
}
