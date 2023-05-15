import type {
  AnyAttributeCondition,
  NonLogicalCondition,
  Condition
} from 'v1/commands/types/condition'

export type InCondition = NonLogicalCondition &
  Extract<AnyAttributeCondition<string, string>, { in: unknown }>

export const isInCondition = (condition: Condition): condition is InCondition => 'in' in condition
