import type { ConditionParsingState } from '../parsingState'

import type { BetweenCondition } from './types'

export const appendBetweenCondition = (
  state: ConditionParsingState,
  condition: BetweenCondition
): void => {
  state.resetConditionExpression()

  const attributePath = condition.size ?? condition.path
  const expressionAttributeValue = condition.between

  const [lowerRange, higherRange] = expressionAttributeValue

  const attribute = state.appendAttributePath(attributePath, { size: !!condition.size })

  state.conditionExpression += ' BETWEEN '

  state.appendAttributeValueOrPath(attribute, lowerRange)

  state.conditionExpression += ' AND '

  state.appendAttributeValueOrPath(attribute, higherRange)
}
