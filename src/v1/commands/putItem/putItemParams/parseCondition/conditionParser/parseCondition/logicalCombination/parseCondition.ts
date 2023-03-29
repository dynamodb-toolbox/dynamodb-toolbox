import type { Condition } from 'v1/commands/condition/types'

import type { ConditionParser } from '../../conditionParser'

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
  conditionParser: ConditionParser,
  condition: CONDITION
) => void

export const parseLogicalCombinationCondition: AppendLogicalCombinationCondition = <
  CONDITION extends LogicalCombinationCondition
>(
  conditionParser: ConditionParser,
  condition: CONDITION
): void => {
  conditionParser.resetConditionExpression()

  const childrenConditionExpressions: string[] = []

  const logicalCombinationOperator = Object.keys(condition).find(
    isLogicalCombinationOperator
  ) as keyof CONDITION & LogicalCombinationOperator

  const childrenConditions = (condition[logicalCombinationOperator] as unknown) as Condition[]

  for (const childrenCondition of childrenConditions) {
    conditionParser.parseCondition(childrenCondition)
    childrenConditionExpressions.push(conditionParser.conditionExpression)
  }

  conditionParser.conditionExpression = `(${childrenConditionExpressions.join(
    `) ${logicalCombinationOperatorExpression[logicalCombinationOperator]} (`
  )})`
}
