import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import type {
  ConditionExpression,
  ParseConditionOptions,
  SchemaCondition
} from '~/schema/actions/parseCondition/index.js'
import { ConditionParser } from '~/schema/actions/parseCondition/index.js'

import { $conditionParser } from './constants.js'

export class EntityConditionParser<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName: 'parseCondition'
  static express(condition: SchemaCondition, expressionId = ''): ConditionExpression {
    return ConditionParser.express(condition, expressionId)
  }

  [$conditionParser]: ConditionParser<ENTITY['schema']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$conditionParser] = new ConditionParser(entity.schema)
  }

  transform(condition: SchemaCondition): SchemaCondition {
    return this[$conditionParser].transform(condition)
  }

  parse(condition: SchemaCondition, options: ParseConditionOptions = {}): ConditionExpression {
    return this[$conditionParser].parse(condition, options)
  }
}

export type Condition<ENTITY extends Entity = Entity> = SchemaCondition<ENTITY['schema']>
