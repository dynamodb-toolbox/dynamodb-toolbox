import type { Attribute } from 'v1/schema'

import { isAttributePath, AppendAttributePathOptions } from '../../expressionParser'
import type { ConditionParser } from './parser'
import type { AppendAttributeValueOptions } from './appendAttributeValue'

export const appendAttributeValueOrPath = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValueOrPath: unknown,
  options: AppendAttributeValueOptions & AppendAttributePathOptions = {}
): void => {
  if (isAttributePath(expressionAttributeValueOrPath)) {
    conditionParser.appendAttributePath(expressionAttributeValueOrPath.attr, options)
  } else {
    conditionParser.appendAttributeValue(attribute, expressionAttributeValueOrPath, options)
  }
}
