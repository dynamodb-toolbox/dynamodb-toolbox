import type { AnyAttrCondition, NonLogicalCondition, SchemaCondition } from '../../condition.js'

export type RangeOperator = 'gt' | 'gte' | 'lt' | 'lte'
export type EqualityOperator = 'eq'
export type ComparisonOperator = 'ne' | EqualityOperator | RangeOperator

const comparisonOperatorSet = new Set<ComparisonOperator>(['ne', 'eq', 'gt', 'gte', 'lt', 'lte'])

type IsComparisonOperatorAsserter = (key: string) => key is ComparisonOperator

export const isComparisonOperator: IsComparisonOperatorAsserter = (
  key
): key is ComparisonOperator => comparisonOperatorSet.has(key as ComparisonOperator)

export type ComparisonCondition = NonLogicalCondition &
  (ComparisonOperator extends infer OPERATOR
    ? OPERATOR extends string
      ? Extract<AnyAttrCondition<string, string>, { [KEY in OPERATOR]: unknown }>
      : never
    : never)

type IsComparisonConditionAsserter = (
  condition: SchemaCondition
) => condition is ComparisonCondition

export const isComparisonCondition: IsComparisonConditionAsserter = (
  condition
): condition is ComparisonCondition => Object.keys(condition).some(isComparisonOperator)
