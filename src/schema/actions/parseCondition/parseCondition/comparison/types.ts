import type {
  AnyAttributeCondition,
  NonLogicalCondition,
  SchemaCondition
} from '../../condition.js'

export type RangeOperator = 'gt' | 'gte' | 'lt' | 'lte'
export type ComparisonOperator = 'eq' | 'ne' | RangeOperator

const comparisonOperatorSet = new Set<ComparisonOperator>(['eq', 'ne', 'gt', 'gte', 'lt', 'lte'])

type IsComparisonOperatorAsserter = (key: string) => key is ComparisonOperator

export const isComparisonOperator: IsComparisonOperatorAsserter = (
  key
): key is ComparisonOperator => comparisonOperatorSet.has(key as ComparisonOperator)

export type ComparisonCondition = NonLogicalCondition &
  (ComparisonOperator extends infer OPERATOR
    ? OPERATOR extends string
      ? Extract<AnyAttributeCondition<string, string>, { [KEY in OPERATOR]: unknown }>
      : never
    : never)

type IsComparisonConditionAsserter = (
  condition: SchemaCondition
) => condition is ComparisonCondition

export const isComparisonCondition: IsComparisonConditionAsserter = (
  condition
): condition is ComparisonCondition => Object.keys(condition).some(isComparisonOperator)
