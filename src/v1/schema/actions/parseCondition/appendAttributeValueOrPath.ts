import type { Attribute } from 'v1/schema/attributes'

import {
  isAttributePath,
  AppendAttributePathOptions
} from 'v1/operations/expression/expressionParser'
import type { ConditionParser } from './conditionParser'
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
