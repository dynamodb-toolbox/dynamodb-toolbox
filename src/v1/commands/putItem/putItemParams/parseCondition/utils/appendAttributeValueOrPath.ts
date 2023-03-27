import type { ParsingState } from '../types'

import { isAttributePath, appendAttributePath } from './appendAttributePath'
import { appendAttributeValue } from './appendAttributeValue'

export const appendAttributeValueOrPath = (
  parsingState: ParsingState,
  expressionAttributeValueOrPath: unknown
): ParsingState => {
  if (isAttributePath(expressionAttributeValueOrPath)) {
    return appendAttributePath(parsingState, expressionAttributeValueOrPath.attr)
  } else {
    return appendAttributeValue(parsingState, expressionAttributeValueOrPath)
  }
}
