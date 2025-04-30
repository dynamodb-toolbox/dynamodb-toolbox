import type { Schema } from '~/schema/index.js'

export interface UpdateExpression {
  UpdateExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
}

export type ExpressionPrefix = 's' | 'r' | 'a' | 'd'

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
