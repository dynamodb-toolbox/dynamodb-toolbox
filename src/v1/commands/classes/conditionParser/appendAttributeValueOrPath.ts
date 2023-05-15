import type { Attribute } from 'v1/item'

import { isAttributePath } from '../utils/appendAttributePath'
import type { ConditionParser } from './conditionParser'

export const appendAttributeValueOrPath = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValueOrPath: unknown
): void => {
  if (isAttributePath(expressionAttributeValueOrPath)) {
    conditionParser.appendAttributePath(expressionAttributeValueOrPath.attr)
  } else {
    conditionParser.appendAttributeValue(attribute, expressionAttributeValueOrPath)
  }
}
