import type { AnyAttributeCondition, SchemaCondition } from '../../condition.js'

export type NotCondition = SchemaCondition &
  Extract<AnyAttributeCondition<string, string>, { not: unknown }>

export const isNotCondition = (condition: SchemaCondition): condition is NotCondition =>
  'not' in condition
