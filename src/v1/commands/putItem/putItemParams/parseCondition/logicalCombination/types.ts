import { Condition } from 'v1/commands/condition/types'

export type LogicalCombinationOperator = 'and' | 'or'

const logicalCombinationOperatorSet = new Set<LogicalCombinationOperator>(['and', 'or'])

export const isLogicalCombinationOperator = (key: string): key is LogicalCombinationOperator =>
  logicalCombinationOperatorSet.has(key as LogicalCombinationOperator)

export type LogicalCombinationCondition = Condition &
  (LogicalCombinationOperator extends infer OPERATOR
    ? OPERATOR extends string
      ? Extract<Condition, { [KEY in OPERATOR]: unknown }>
      : never
    : never)

export const isLogicalCombinationCondition = (
  condition: Condition
): condition is LogicalCombinationCondition =>
  Object.keys(condition).some(isLogicalCombinationOperator)
