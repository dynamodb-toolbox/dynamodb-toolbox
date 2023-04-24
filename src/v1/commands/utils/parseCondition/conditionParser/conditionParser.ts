import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { Item, Attribute } from 'v1/item'
import type { Condition } from 'v1/commands/condition/types'

import { appendAttributePath } from './appendAttributePath'
import { appendAttributeValue } from './appendAttributeValue'
import { appendAttributeValueOrPath } from './appendAttributeValueOrPath'
import { parseCondition } from './parseCondition'
import { toCommandOptions } from './toCommandOptions'

export class ConditionParser {
  schema: Attribute | Item
  expressionAttributeNames: string[]
  expressionAttributeValues: unknown[]
  conditionExpression: string

  constructor(schema: Attribute | Item) {
    this.schema = schema
    this.expressionAttributeNames = []
    this.expressionAttributeValues = []
    this.conditionExpression = ''
  }

  resetConditionExpression = (initialStr = '') => {
    this.conditionExpression = initialStr
  }

  appendAttributePath = (attributePath: string, options: { size?: boolean } = {}): Attribute =>
    appendAttributePath(this, attributePath, options)

  appendAttributeValue = (attribute: Attribute, expressionAttributeValue: unknown): void =>
    appendAttributeValue(this, attribute, expressionAttributeValue)

  appendAttributeValueOrPath = (
    attribute: Attribute,
    expressionAttributeValueOrPath: unknown
  ): void => appendAttributeValueOrPath(this, attribute, expressionAttributeValueOrPath)

  appendToConditionExpression = (conditionExpressionPart: string) => {
    this.conditionExpression += conditionExpressionPart
  }

  parseCondition = (condition: Condition): void => parseCondition(this, condition)

  toCommandOptions = (): {
    ConditionExpression: string
    ExpressionAttributeNames: Record<string, string>
    ExpressionAttributeValues: Record<string, NativeAttributeValue>
  } => toCommandOptions(this)
}
