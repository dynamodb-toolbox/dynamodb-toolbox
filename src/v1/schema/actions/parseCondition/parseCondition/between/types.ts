import type {
  AnyAttributeCondition,
  NonLogicalCondition,
  SchemaCondition
} from '../../condition.js'

export type BetweenOperator = 'between'
export type BetweenCondition = NonLogicalCondition &
  Extract<AnyAttributeCondition<string, string>, Record<BetweenOperator, unknown>>

export const isBetweenCondition = (condition: SchemaCondition): condition is BetweenCondition =>
  'between' in condition
