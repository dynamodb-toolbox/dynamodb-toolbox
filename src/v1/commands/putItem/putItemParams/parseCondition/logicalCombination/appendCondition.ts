import type { Condition } from 'v1/commands/condition/types'

import type { ConditionParsingState } from '../parsingState'
import { appendCondition } from '../appendCondition'

import {
  isLogicalCombinationOperator,
  LogicalCombinationCondition,
  LogicalCombinationOperator
} from './types'

const logicalCombinationOperatorExpression: Record<LogicalCombinationOperator, string> = {
  or: 'OR',
  and: 'AND'
}

type AppendLogicalCombinationCondition = <CONDITION extends LogicalCombinationCondition>(
  state: ConditionParsingState,
  condition: CONDITION
) => void

export const appendLogicalCombinationCondition: AppendLogicalCombinationCondition = <
  CONDITION extends LogicalCombinationCondition
>(
  state: ConditionParsingState,
  condition: CONDITION
): void => {
  state.resetConditionExpression()

  const childrenConditionExpressions: string[] = []

  const logicalCombinationOperator = Object.keys(condition).find(
    isLogicalCombinationOperator
  ) as keyof CONDITION & LogicalCombinationOperator

  const childrenConditions = (condition[logicalCombinationOperator] as unknown) as Condition[]

  for (const childrenCondition of childrenConditions) {
    appendCondition(state, childrenCondition)
    childrenConditionExpressions.push(state.conditionExpression)
  }

  state.conditionExpression = `(${childrenConditionExpressions.join(
    `) ${logicalCombinationOperatorExpression[logicalCombinationOperator]} (`
  )})`
}
