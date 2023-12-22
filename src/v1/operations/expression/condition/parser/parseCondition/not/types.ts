import type { AnyAttributeCondition, Condition } from 'v1/operations/types'

export type NotCondition = Condition &
  Extract<AnyAttributeCondition<string, string>, { not: unknown }>

export const isNotCondition = (condition: Condition): condition is NotCondition =>
  'not' in condition
