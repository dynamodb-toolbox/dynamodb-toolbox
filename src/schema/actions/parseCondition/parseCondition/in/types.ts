import type { AnyAttrCondition, SchemaCondition } from '../../condition.js'

export type InCondition = Extract<AnyAttrCondition<string, string>, { in: unknown }>

export const isInCondition = (condition: SchemaCondition): condition is InCondition =>
  'in' in condition
