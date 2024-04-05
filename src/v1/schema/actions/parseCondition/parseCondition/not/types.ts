import type { AnyAttributeCondition, Condition } from '../../condition'

export type NotCondition = Condition &
  Extract<AnyAttributeCondition<string, string>, { not: unknown }>

export const isNotCondition = (condition: Condition): condition is NotCondition =>
  'not' in condition
