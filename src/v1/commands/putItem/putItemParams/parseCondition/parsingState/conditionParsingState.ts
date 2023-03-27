import type { Item, Attribute } from 'v1/item'

import { appendAttributePath } from './appendAttributePath'
import { appendAttributeValue } from './appendAttributeValue'
import { appendAttributeValueOrPath } from './appendAttributeValueOrPath'

export class ConditionParsingState {
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

  resetConditionExpression = () => {
    this.conditionExpression = ''
  }

  appendAttributePath = (attributePath: string, options: { size?: boolean } = {}): Attribute =>
    appendAttributePath(this, attributePath, options)

  appendAttributeValue = (attribute: Attribute, expressionAttributeValue: unknown): void =>
    appendAttributeValue(this, attribute, expressionAttributeValue)

  appendAttributeValueOrPath = (
    attribute: Attribute,
    expressionAttributeValueOrPath: unknown
  ): void => appendAttributeValueOrPath(this, attribute, expressionAttributeValueOrPath)
}
