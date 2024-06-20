import type { Attribute } from '~/schema/attributes/index.js'

import {
  isAttributePath,
  AppendAttributePathOptions
} from '~/schema/actions/utils/appendAttributePath.js'
import type { ConditionParser } from './conditionParser.js'
import type { AppendAttributeValueOptions } from './appendAttributeValue.js'

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
