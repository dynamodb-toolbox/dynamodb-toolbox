import { isObject } from 'v1/utils/validation/isObject'
import { isString } from 'v1/utils/validation/isString'

import type { ParsingState } from '../types'

export const isAttributePath = (candidate: unknown): candidate is { attr: string } =>
  isObject(candidate) && 'attr' in candidate && isString(candidate.attr)

export const appendAttributePathToState = (
  prevParsingState: ParsingState,
  attributePath: string,
  options: { size?: boolean } = {}
): ParsingState => {
  const nextParsingState: ParsingState = {
    expressionAttributeNames: [...prevParsingState.expressionAttributeNames],
    expressionAttributeValues: [...prevParsingState.expressionAttributeValues],
    conditionExpression: prevParsingState.conditionExpression
  }

  const pathMatches = attributePath.matchAll(/\w+(?=(\.|$|((\[\d+\])+)))/g)

  for (const pathMatch of pathMatches) {
    const [expressionAttributeName, followingSeparator] = pathMatch

    const expressionAttributeNameIndex = nextParsingState.expressionAttributeNames.push(
      expressionAttributeName
    )

    const conditionExpressionPath = `#${expressionAttributeNameIndex}${followingSeparator}`

    nextParsingState.conditionExpression += options.size
      ? `size(${conditionExpressionPath})`
      : conditionExpressionPath
  }

  return nextParsingState
}
