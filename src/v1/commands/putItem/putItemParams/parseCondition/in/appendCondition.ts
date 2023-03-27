import type { ConditionParsingState } from '../parsingState'

import type { InCondition } from './types'

export const appendInCondition = (state: ConditionParsingState, condition: InCondition): void => {
  state.resetConditionExpression()

  const attributePath = condition.size ?? condition.path
  const expressionAttributeValues = condition.in

  const attribute = state.appendAttributePath(attributePath, { size: !!condition.size })

  state.conditionExpression += ' IN ('

  expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    if (index > 0) {
      state.conditionExpression += ', '
    }

    state.appendAttributeValueOrPath(attribute, expressionAttributeValue)
  })

  state.conditionExpression += ')'
}
