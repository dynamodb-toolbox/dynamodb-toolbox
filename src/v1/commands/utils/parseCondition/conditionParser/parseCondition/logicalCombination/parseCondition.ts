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
  const logicalCombinationOperator = Object.keys(condition).find(
    isLogicalCombinationOperator
  ) as keyof CONDITION & LogicalCombinationOperator

  const childrenConditions = (condition[logicalCombinationOperator] as unknown) as Condition[]
  const childrenConditionExpressions: string[] = []
  conditionParser.resetConditionExpression()
  for (const childCondition of childrenConditions) {
    conditionParser.parseCondition(childCondition)
    childrenConditionExpressions.push(conditionParser.conditionExpression)
  }
  conditionParser.resetConditionExpression(
    `(${childrenConditionExpressions.join(
      `) ${logicalCombinationOperatorExpression[logicalCombinationOperator]} (`
    )})`
  )
}
