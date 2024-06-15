import type { AnyAttributeCondition, NonLogicalCondition, SchemaCondition } from '../../condition'

export type InCondition = NonLogicalCondition &
  Extract<AnyAttributeCondition<string, string>, { in: unknown }>

export const isInCondition = (condition: SchemaCondition): condition is InCondition =>
  'in' in condition
