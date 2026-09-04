/**
 * Mutable state threaded through condition expression building.
 */
export interface ExpressionState {
  namesCursor: number
  valuesCursor: number
  tokens: Record<string, string>
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
}
