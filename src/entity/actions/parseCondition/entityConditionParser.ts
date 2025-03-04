import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { ConditionParser } from '~/schema/actions/parseCondition/index.js'
import type { SchemaCondition } from '~/schema/actions/parseCondition/index.js'

import { $conditionParser } from './constants.js'

export class EntityConditionParser<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName: 'parseCondition';

  [$conditionParser]: ConditionParser<ENTITY['schema']>

  constructor(entity: ENTITY, id: string = '') {
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

export type Condition<ENTITY extends Entity = Entity> = SchemaCondition<ENTITY['schema']>
