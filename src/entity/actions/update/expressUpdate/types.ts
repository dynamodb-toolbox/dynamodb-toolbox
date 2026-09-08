import type { Schema } from '~/schema/index.js'

/** DynamoDB update expression, along with its attribute names and values. */
export interface UpdateExpression {
  UpdateExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
}

/** Prefix identifying the expression clause a token belongs to (`SET`, `REMOVE`, `ADD` or `DELETE`). */
export type ExpressionPrefix = 's' | 'r' | 'a' | 'd'

/** Accumulator threaded through the update expression build: clauses, tokens and cursors. */
export interface ExpressionState {
  /**
   * @debt "TODO: Validate reference in parseUpdateExpression and remove schema here"
   */
  rootSchema: Schema
  tokens: Record<ExpressionPrefix, Record<string, string>>
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
  nameCursors: Record<ExpressionPrefix, number>
  valueCursors: Record<ExpressionPrefix, number>
  setExpressions: string[]
  removeExpressions: string[]
  addExpressions: string[]
  deleteExpressions: string[]
}
