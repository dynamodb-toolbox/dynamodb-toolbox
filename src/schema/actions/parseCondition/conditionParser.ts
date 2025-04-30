import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import type { SchemaCondition } from './condition.js'
import { expressCondition } from './expressCondition/expressCondition.js'
import { transformCondition } from './transformCondition/index.js'
import type { ConditionExpression } from './types.js'

export interface ParseConditionOptions {
  expressionId?: string
}

export class ConditionParser<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'parseCondition' as const
  static express(condition: SchemaCondition, expressionId = ''): ConditionExpression {
    return expressCondition(condition, expressionId)
  }

  transform(condition: SchemaCondition): SchemaCondition {
    return transformCondition(this.schema, condition)
  }

  parse(
    condition: SchemaCondition,
    { expressionId }: ParseConditionOptions = {}
  ): ConditionExpression {
    return ConditionParser.express(this.transform(condition), expressionId)
  }
}
