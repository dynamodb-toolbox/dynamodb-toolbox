import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import type { SchemaCondition } from './condition.js'
import { expressCondition } from './expressCondition/expressCondition.js'
import { transformCondition } from './transformCondition/index.js'
import type { ConditionExpression } from './types.js'

/**
 * Options accepted by the condition parser.
 */
export interface ParseConditionOptions {
  expressionId?: string
}

/**
 * Compiles a condition into a DynamoDB condition expression.
 */
export class ConditionParser<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'parseCondition' as const

  /**
   * Render a transformed condition into a condition expression.
   */
  static express(condition: SchemaCondition, expressionId = ''): ConditionExpression {
    return expressCondition(condition, expressionId)
  }

  /**
   * Apply schema transformers to a condition's operands.
   */
  transform(condition: SchemaCondition): SchemaCondition {
    return transformCondition(this.schema, condition)
  }

  /**
   * Compile a condition into a condition expression.
   */
  parse(
    condition: SchemaCondition,
    { expressionId }: ParseConditionOptions = {}
  ): ConditionExpression {
    return ConditionParser.express(this.transform(condition), expressionId)
  }
}
