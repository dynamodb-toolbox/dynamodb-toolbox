import type { Conditions } from 'v1/commands/conditions/types'

import { ParsingState } from './types'
import { parseComparisonCondition } from './comparison/parse'
import { parseSingleArgFnCondition } from './singleArgFn/parse'
import { detectConditionType } from './utils/detectConditionType'

export const parseCondition = (
  conditions: Conditions,
  state: ParsingState = {
    expressionAttributeNames: [],
    expressionAttributeValues: [],
    conditionExpression: ''
  }
): ParsingState => {
  const results = detectConditionType(conditions)

  switch (results?.type) {
    case 'comparison': {
      const { condition, operator } = results
      return parseComparisonCondition(condition, operator, state)
    }
    case 'singleArgFn': {
      const { condition, operator } = results
      return parseSingleArgFnCondition(condition, operator, state)
    }
    default:
      return state
  }
}
