/**
 * A DynamoDB projection expression and its attribute-name map.
 */
export interface ProjectionExpression {
  ProjectionExpression: string
  ExpressionAttributeNames: Record<string, string>
}
