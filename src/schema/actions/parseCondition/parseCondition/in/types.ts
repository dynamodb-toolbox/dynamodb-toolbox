import type { AnySchemaCondition, SchemaCondition } from '../../condition.js'

export type InCondition = Extract<AnySchemaCondition<string, string>, { in: unknown }>

export const isInCondition = (condition: SchemaCondition): condition is InCondition =>
  'in' in condition
