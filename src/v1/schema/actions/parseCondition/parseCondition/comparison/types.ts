import type { AnyAttributeCondition, NonLogicalCondition, SchemaCondition } from '../../condition'

export type RangeOperator = 'gt' | 'gte' | 'lt' | 'lte'
export type ComparisonOperator = 'eq' | 'ne' | RangeOperator

const comparisonOperatorSet = new Set<ComparisonOperator>(['eq', 'ne', 'gt', 'gte', 'lt', 'lte'])

export const isComparisonOperator = (key: string): key is ComparisonOperator =>
  comparisonOperatorSet.has(key as ComparisonOperator)

export type ComparisonCondition = NonLogicalCondition &
  (ComparisonOperator extends infer OPERATOR
    ? OPERATOR extends string
      ? Extract<AnyAttributeCondition<string, string>, { [KEY in OPERATOR]: unknown }>
      : never
    : never)

export const isComparisonCondition = (
  condition: SchemaCondition
): condition is ComparisonCondition => Object.keys(condition).some(isComparisonOperator)
