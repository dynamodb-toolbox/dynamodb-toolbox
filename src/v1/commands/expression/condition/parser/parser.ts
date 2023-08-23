import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { Schema, Attribute } from 'v1/schema'
import type { Condition } from 'v1/commands/types'

import { ExpressionParser, appendAttributePath } from '../../expressionParser'
import { appendAttributeValue } from './appendAttributeValue'
import { appendAttributeValueOrPath } from './appendAttributeValueOrPath'
import { parseCondition } from './parseCondition'
import { toCommandOptions } from './toCommandOptions'

export class ConditionParser implements ExpressionParser {
  schema: Schema | Attribute
  expressionAttributePrefix: 'c'
  expressionAttributeNames: string[]
  expressionAttributeValues: unknown[]
  expression: string

  constructor(schema: Schema | Attribute) {
    this.schema = schema
    this.expressionAttributePrefix = 'c'
    this.expressionAttributeNames = []
    this.expressionAttributeValues = []
    this.expression = ''
  }

  resetExpression = (initialStr = '') => {
    this.expression = initialStr
  }

  appendAttributePath = (attributePath: string, options: { size?: boolean } = {}): Attribute =>
    appendAttributePath(this, attributePath, options)

  appendAttributeValue = (attribute: Attribute, expressionAttributeValue: unknown): void =>
    appendAttributeValue(this, attribute, expressionAttributeValue)

  appendAttributeValueOrPath = (
    attribute: Attribute,
    expressionAttributeValueOrPath: unknown
  ): void => appendAttributeValueOrPath(this, attribute, expressionAttributeValueOrPath)

  appendToExpression = (conditionExpressionPart: string) => {
    this.expression += conditionExpressionPart
  }

  parseCondition = (condition: Condition): void => parseCondition(this, condition)

  toCommandOptions = (): {
    ConditionExpression: string
    ExpressionAttributeNames: Record<string, string>
    ExpressionAttributeValues: Record<string, NativeAttributeValue>
  } => toCommandOptions(this)

  clone = (schema?: Schema | Attribute): ConditionParser => {
    const clonedParser = new ConditionParser(schema ?? this.schema)

    clonedParser.expressionAttributeNames = [...this.expressionAttributeNames]
    clonedParser.expressionAttributeValues = [...this.expressionAttributeValues]
    clonedParser.expression = this.expression

    return clonedParser
  }
}
