import type { AnyAttributeCondition, SchemaCondition } from '../../condition'

export type InCondition = Extract<AnyAttributeCondition<string, string>, { in: unknown }>

export const isInCondition = (condition: SchemaCondition): condition is InCondition =>
  'in' in condition
