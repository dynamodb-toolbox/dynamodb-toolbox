import type { AnyAttributeCondition, NonLogicalCondition, Condition } from '../../condition'

export type InCondition = NonLogicalCondition &
  Extract<AnyAttributeCondition<string, string>, { in: unknown }>

export const isInCondition = (condition: Condition): condition is InCondition => 'in' in condition
