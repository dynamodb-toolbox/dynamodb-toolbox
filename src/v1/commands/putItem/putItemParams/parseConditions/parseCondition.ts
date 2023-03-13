import type { Conditions } from 'v1/commands/conditions/types'

type ParsingState = {
  expressionAttributeNames: string[]
  expressionAttributeValues: unknown[]
  conditionExpression: string
}

export const parseCondition = (
  conditions: Conditions,
  state: ParsingState = {
    expressionAttributeNames: [],
    expressionAttributeValues: [],
    conditionExpression: ''
  }
): ParsingState => {
  if ('gt' in conditions) {
    const { path, gt: expressionAttributeValue } = conditions

    const pathMatches = path.matchAll(/\w+(?=(\.|$|(\[\d+\])))/g)

    let conditionExpression = ''

    for (const pathMatch of pathMatches) {
      const [expressionAttributeName, followingSeparator] = pathMatch

      const expressionAttributeNameIndex = state.expressionAttributeNames.push(
        expressionAttributeName
      )
      conditionExpression += `#${expressionAttributeNameIndex}${followingSeparator}`
    }

    const expressionAttributeValueIndex = state.expressionAttributeValues.push(
      expressionAttributeValue
    )
    conditionExpression += ` > :${expressionAttributeValueIndex}`

    return { ...state, conditionExpression }
  }

  return state
}
