import type { AnySchemaCondition, SchemaCondition } from '../../condition.js'

export type NotCondition = SchemaCondition &
  Extract<AnySchemaCondition<string, string>, { not: unknown }>

export const isNotCondition = (condition: SchemaCondition): condition is NotCondition =>
  'not' in condition
