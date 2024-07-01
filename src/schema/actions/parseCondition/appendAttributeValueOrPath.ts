import { isAttributePath } from '~/schema/actions/utils/appendAttributePath.js'
import type { AppendAttributePathOptions } from '~/schema/actions/utils/appendAttributePath.js'
import type { Attribute } from '~/schema/attributes/index.js'

import type { AppendAttributeValueOptions } from './appendAttributeValue.js'
import type { ConditionParser } from './conditionParser.js'

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
