import type { ParsingState } from '../types'

export const appendAttributeValue = (
  prevParsingState: ParsingState,
  expressionAttributeValue: unknown
): ParsingState => {
  const nextParsingState: ParsingState = {
    expressionAttributeNames: [...prevParsingState.expressionAttributeNames],
    expressionAttributeValues: [...prevParsingState.expressionAttributeValues],
    conditionExpression: prevParsingState.conditionExpression
  }

  const expressionAttributeValueIndex = nextParsingState.expressionAttributeValues.push(
    expressionAttributeValue
  )

  nextParsingState.conditionExpression += `:${expressionAttributeValueIndex}`

  return nextParsingState
}
