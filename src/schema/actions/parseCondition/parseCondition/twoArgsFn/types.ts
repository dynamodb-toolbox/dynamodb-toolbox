import type { AnyAttrCondition, NonLogicalCondition, SchemaCondition } from '../../condition.js'

export type BeginsWithOperator = 'beginsWith'
export type TwoArgsFnOperator = 'contains' | 'type' | BeginsWithOperator

const twoArgsFnOperatorSet = new Set<TwoArgsFnOperator>(['contains', 'beginsWith', 'type'])

type IsTwoArgsFnOperatorAsserter = (key: string) => key is TwoArgsFnOperator

export const isTwoArgsFnOperator: IsTwoArgsFnOperatorAsserter = (
  key: string
): key is TwoArgsFnOperator => twoArgsFnOperatorSet.has(key as TwoArgsFnOperator)

export type TwoArgsFnCondition = NonLogicalCondition &
  (TwoArgsFnOperator extends infer OPERATOR
    ? OPERATOR extends string
      ? Extract<AnyAttrCondition<string, string>, { [KEY in OPERATOR]: unknown }>
      : never
    : never)

type IsTwoArgsFnConditionAsserter = (condition: SchemaCondition) => condition is TwoArgsFnCondition

export const isTwoArgsFnCondition: IsTwoArgsFnConditionAsserter = (
  condition
): condition is TwoArgsFnCondition => Object.keys(condition).some(isTwoArgsFnOperator)
