import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { EntityV2, EntityAction } from 'v1/entity'
import { ConditionParser, Condition } from 'v1/schema/actions/parseCondition'

const $conditionParser = Symbol('$conditionParser')
type $conditionParser = typeof $conditionParser

export class EntityConditionParser<
  ENTITY extends EntityV2 = EntityV2
> extends EntityAction<ENTITY> {
  static operationName: 'parseCondition';
  [$conditionParser]: ConditionParser<ENTITY['schema']>

  constructor(entity: ENTITY, id = '') {
    super(entity)
    this[$conditionParser] = new ConditionParser(entity.schema, id)
  }

  setId(nextId: string): this {
    this[$conditionParser].setId(nextId)
    return this
  }

  parse = (condition: Condition): this => {
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

export type EntityCondition<ENTITY extends EntityV2 = EntityV2> = Condition<ENTITY['schema']>
