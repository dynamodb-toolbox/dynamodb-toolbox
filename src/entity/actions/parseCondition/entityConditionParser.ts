import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import type {
  ConditionExpression,
  ParseConditionOptions,
  SchemaCondition
} from '~/schema/actions/parseCondition/index.js'
import { ConditionParser } from '~/schema/actions/parseCondition/index.js'

import { $conditionParser } from './constants.js'

/** Build a DynamoDB condition expression from a `Condition` on an entity. */
export class EntityConditionParser<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName: 'parseCondition'
  /** Express a condition that has already been transformed. */
  static express(condition: SchemaCondition, expressionId = ''): ConditionExpression {
    return ConditionParser.express(condition, expressionId)
  }

  [$conditionParser]: ConditionParser<ENTITY['schema']>

  /** Bind the parser to an entity. */
  constructor(entity: ENTITY) {
    super(entity)
    this[$conditionParser] = new ConditionParser(entity.schema)
  }

  /** Rename the condition attribute paths to their saved names. */
  transform(condition: SchemaCondition): SchemaCondition {
    return this[$conditionParser].transform(condition)
  }

  /** Turn a condition into a DynamoDB condition expression. */
  parse(condition: SchemaCondition, options: ParseConditionOptions = {}): ConditionExpression {
    return this[$conditionParser].parse(condition, options)
  }
}

/** Condition on the attributes of an entity. */
export type Condition<ENTITY extends Entity = Entity> = SchemaCondition<ENTITY['schema']>
