import type { AnyAttributeCondition, NonLogicalCondition, Condition } from 'v1/operations/types'

export type SingleArgFnCondition = NonLogicalCondition &
  Extract<AnyAttributeCondition<string, string>, { exists: unknown }>

export const isSingleArgFnCondition = (condition: Condition): condition is SingleArgFnCondition =>
  'exists' in condition
