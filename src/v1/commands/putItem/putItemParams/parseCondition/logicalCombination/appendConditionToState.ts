import type { Condition } from 'v1/commands/condition/types'

import type { ParsingState } from '../types'
import { appendConditionToState } from '../appendConditionToState'

import {
  isLogicalCombinationOperator,
  LogicalCombinationCondition,
  LogicalCombinationOperator
} from './types'

const logicalCombinationOperatorExpression: Record<LogicalCombinationOperator, string> = {
  or: 'OR',
  and: 'AND'
}

export const appendLogicalCombinationConditionToState = <
  CONDITION extends LogicalCombinationCondition
>(
  prevParsingState: ParsingState,
  condition: CONDITION
): ParsingState => {
  let nextParsingState: ParsingState = {
    expressionAttributeNames: [...prevParsingState.expressionAttributeNames],
    expressionAttributeValues: [...prevParsingState.expressionAttributeValues],
    conditionExpression: ''
  }

  const childrenConditionExpressions: string[] = []

  const logicalCombinationOperator = Object.keys(condition).find(
    isLogicalCombinationOperator
  ) as keyof CONDITION & LogicalCombinationOperator

  const childrenConditions = (condition[logicalCombinationOperator] as unknown) as Condition[]

  for (const childrenCondition of childrenConditions) {
    nextParsingState = appendConditionToState(nextParsingState, childrenCondition)
    childrenConditionExpressions.push(nextParsingState.conditionExpression)
  }

  return {
    ...nextParsingState,
    conditionExpression: `(${childrenConditionExpressions.join(
      `) ${logicalCombinationOperatorExpression[logicalCombinationOperator]} (`
    )})`
  }
}
