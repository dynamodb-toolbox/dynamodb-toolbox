import type {
  AnyAttributeCondition,
  NonLogicalCondition,
  Condition
} from 'v1/commands/condition/types'

export type ComparisonOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'

const comparisonOperatorSet = new Set<ComparisonOperator>(['eq', 'ne', 'gt', 'gte', 'lt', 'lte'])

export const isComparisonOperator = (key: string): key is ComparisonOperator =>
  comparisonOperatorSet.has(key as ComparisonOperator)

export type ComparisonCondition = NonLogicalCondition &
  (ComparisonOperator extends infer OPERATOR
    ? OPERATOR extends string
      ? Extract<AnyAttributeCondition<string, string>, { [KEY in OPERATOR]: unknown }>
      : never
    : never)

export const isComparisonCondition = (condition: Condition): condition is ComparisonCondition =>
  Object.keys(condition).some(isComparisonOperator)
