import type { SchemaCondition } from '../../condition.js'

export type LogicalCombinationOperator = 'and' | 'or'

const logicalCombinationOperatorSet = new Set<LogicalCombinationOperator>(['and', 'or'])

export const isLogicalCombinationOperator = (key: string): key is LogicalCombinationOperator =>
  logicalCombinationOperatorSet.has(key as LogicalCombinationOperator)

export type LogicalCombinationCondition = SchemaCondition &
  (LogicalCombinationOperator extends infer OPERATOR
    ? OPERATOR extends string
      ? Extract<SchemaCondition, { [KEY in OPERATOR]: unknown }>
      : never
    : never)

type IsLogicalCombinationCondition = (
  condition: SchemaCondition
) => condition is LogicalCombinationCondition

export const isLogicalCombinationCondition: IsLogicalCombinationCondition = (
  condition: SchemaCondition
): condition is LogicalCombinationCondition =>
  Object.keys(condition).some(isLogicalCombinationOperator)
