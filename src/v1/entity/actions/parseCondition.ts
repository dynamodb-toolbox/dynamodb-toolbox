import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { EntityV2, EntityAction } from 'v1/entity/index.js'
import { ConditionParser, SchemaCondition } from 'v1/schema/actions/parseCondition/index.js'

const $conditionParser = Symbol('$conditionParser')
type $conditionParser = typeof $conditionParser

export class EntityConditionParser<
  ENTITY extends EntityV2 = EntityV2
> extends EntityAction<ENTITY> {
  static actionName: 'parseCondition';
  [$conditionParser]: ConditionParser<ENTITY['schema']>

  constructor(entity: ENTITY, id = '') {
    super(entity)
    this[$conditionParser] = new ConditionParser(entity.schema, id)
  }

  setId(nextId: string): this {
    this[$conditionParser].setId(nextId)
    return this
  }

  parse = (condition: SchemaCondition): this => {
    this[$conditionParser].parse(condition)
    return this
  }

  toCommandOptions(): {
    ConditionExpression: string
    ExpressionAttributeNames: Record<string, string>
    ExpressionAttributeValues: Record<string, NativeAttributeValue>
  } {
    return this[$conditionParser].toCommandOptions()
  }
}

export type Condition<ENTITY extends EntityV2 = EntityV2> = SchemaCondition<ENTITY['schema']>
