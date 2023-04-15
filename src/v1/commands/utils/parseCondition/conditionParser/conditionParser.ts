import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { Item, Attribute } from 'v1/item'
import type { Condition } from 'v1/commands/condition/types'

import { appendAttributePath } from './appendAttributePath'
import { appendAttributeValue } from './appendAttributeValue'
import { appendAttributeValueOrPath } from './appendAttributeValueOrPath'
import { parseCondition } from './parseCondition'
import { toCommandOptions } from './toCommandOptions'

export class ConditionParser {
  item: Item
  expressionAttributeNames: string[]
  expressionAttributeValues: unknown[]
  conditionExpression: string

  constructor(item: Item) {
    this.item = item
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

  toCommandOptions = (): Pick<
    PutCommandInput,
    'ExpressionAttributeNames' | 'ExpressionAttributeValues' | 'ConditionExpression'
  > => toCommandOptions(this)
}
