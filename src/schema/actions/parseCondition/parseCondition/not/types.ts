import type { AnyAttrCondition, SchemaCondition } from '../../condition.js'

export type NotCondition = SchemaCondition &
  Extract<AnyAttrCondition<string, string>, { not: unknown }>

export const isNotCondition = (condition: SchemaCondition): condition is NotCondition =>
  'not' in condition
