import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { Schema, SchemaAction } from 'v1/schema'
import type { Attribute } from 'v1/schema/attributes'
import {
  ExpressionParser,
  appendAttributePath,
  AppendAttributePathOptions
} from 'v1/schema/actions/utils/appendAttributePath'

import { appendAttributeValue, AppendAttributeValueOptions } from './appendAttributeValue'
import { appendAttributeValueOrPath } from './appendAttributeValueOrPath'
import { parseCondition } from './parseCondition'
import { toCommandOptions } from './toCommandOptions'
import type { SchemaCondition } from './condition'

export class ConditionParser<SCHEMA extends Schema | Attribute = Schema | Attribute>
  extends SchemaAction<SCHEMA>
  implements ExpressionParser {
  expressionAttributePrefix: `c${string}_`
  expressionAttributeNames: string[]
  expressionAttributeValues: unknown[]
  expression: string
  id: string

  constructor(schema: SCHEMA, id = '') {
    super(schema)

    this.id = id
    this.expressionAttributePrefix = `c${id}_`

    this.expressionAttributeNames = []
    this.expressionAttributeValues = []
    this.expression = ''
  }

  setId(nextId: string): this {
    this.id = nextId
    this.expressionAttributePrefix = `c${nextId}_`
    return this
  }

  resetExpression(initialStr = ''): this {
    this.expression = initialStr
    return this
  }

  appendAttributePath(attributePath: string, options: AppendAttributePathOptions = {}): Attribute {
    return appendAttributePath(this, attributePath, options)
  }

  appendAttributeValue(
    attribute: Attribute,
    expressionAttributeValue: unknown,
    options: AppendAttributeValueOptions = {}
  ): this {
    appendAttributeValue(this, attribute, expressionAttributeValue, options)
    return this
  }

  appendAttributeValueOrPath(
    attribute: Attribute,
    expressionAttributeValueOrPath: unknown,
    options: AppendAttributePathOptions & AppendAttributeValueOptions = {}
  ): this {
    appendAttributeValueOrPath(this, attribute, expressionAttributeValueOrPath, options)
    return this
  }

  appendToExpression(conditionExpressionPart: string): this {
    this.expression += conditionExpressionPart
    return this
  }

  parse(condition: SchemaCondition): this {
    parseCondition(this, condition)
    return this
  }

  toCommandOptions(): {
    ConditionExpression: string
    ExpressionAttributeNames: Record<string, string>
    ExpressionAttributeValues: Record<string, NativeAttributeValue>
  } {
    return toCommandOptions(this)
  }

  clone(schema?: Schema | Attribute): ConditionParser {
    const clonedParser = new ConditionParser(schema ?? this.schema, this.id)

    clonedParser.expressionAttributeNames = [...this.expressionAttributeNames]
    clonedParser.expressionAttributeValues = [...this.expressionAttributeValues]
    clonedParser.expression = this.expression

    return clonedParser
  }
}
