import type { Attribute } from 'v1/schema'

import { isAttributePath } from '../../expressionParser'
import type { ConditionParser } from './parser'

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
