import type { ParsingState } from '../types'

export const parseAttributePath = (attributePath: string, parsingState: ParsingState): void => {
  const pathMatches = attributePath.matchAll(/\w+(?=(\.|$|((\[\d+\])+)))/g)

  for (const pathMatch of pathMatches) {
    const [expressionAttributeName, followingSeparator] = pathMatch

    const expressionAttributeNameIndex = parsingState.expressionAttributeNames.push(
      expressionAttributeName
    )
    parsingState.conditionExpression += `#${expressionAttributeNameIndex}${followingSeparator}`
  }
}
