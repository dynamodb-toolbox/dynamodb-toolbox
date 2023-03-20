export type ComparisonOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'

const comparisonOperatorSet = new Set<ComparisonOperator>(['eq', 'ne', 'gt', 'gte', 'lt', 'lte'])

export const isComparisonOperator = (key: string): key is ComparisonOperator =>
  comparisonOperatorSet.has(key as ComparisonOperator)
