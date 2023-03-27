import type { Attribute } from 'v1/item'

import { isAttributePath, appendAttributePath } from './appendAttributePath'
import { appendAttributeValue } from './appendAttributeValue'
import type { ConditionParsingState } from './conditionParsingState'

export const appendAttributeValueOrPath = (
  state: ConditionParsingState,
  attribute: Attribute,
  expressionAttributeValueOrPath: unknown
): void => {
  if (isAttributePath(expressionAttributeValueOrPath)) {
    appendAttributePath(state, expressionAttributeValueOrPath.attr)
  } else {
    appendAttributeValue(state, attribute, expressionAttributeValueOrPath)
  }
}
