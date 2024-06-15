import type { AnyAttributeCondition, NonLogicalCondition, SchemaCondition } from '../../condition'

export type BeginsWithOperator = 'beginsWith'
export type TwoArgsFnOperator = 'contains' | 'type' | BeginsWithOperator

const twoArgsFnOperatorSet = new Set<TwoArgsFnOperator>(['contains', 'beginsWith', 'type'])

export const isTwoArgsFnOperator = (key: string): key is TwoArgsFnOperator =>
  twoArgsFnOperatorSet.has(key as TwoArgsFnOperator)

export type TwoArgsFnCondition = NonLogicalCondition &
  (TwoArgsFnOperator extends infer OPERATOR
    ? OPERATOR extends string
      ? Extract<AnyAttributeCondition<string, string>, { [KEY in OPERATOR]: unknown }>
      : never
    : never)

export const isTwoArgsFnCondition = (condition: SchemaCondition): condition is TwoArgsFnCondition =>
  Object.keys(condition).some(isTwoArgsFnOperator)
