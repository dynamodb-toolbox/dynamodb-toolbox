/**
 * A DynamoDB condition expression and its attribute name/value maps.
 */
export interface ConditionExpression {
  ConditionExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
}
