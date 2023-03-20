import type { ParsingState } from '../types'

import { isAttributePath, appendAttributePathToState } from './appendAttributePathToState'
import { appendAttributeValueToState } from './appendAttributeValueToState'

export const appendAttributeValueOrPathToState = (
  parsingState: ParsingState,
  expressionAttributeValueOrPath: unknown
): ParsingState => {
  if (isAttributePath(expressionAttributeValueOrPath)) {
    return appendAttributePathToState(parsingState, expressionAttributeValueOrPath.attr)
  } else {
    return appendAttributeValueToState(parsingState, expressionAttributeValueOrPath)
  }
}
