import type { AnySchemaCondition, NonLogicalCondition, SchemaCondition } from '../../condition.js'

export type BetweenOperator = 'between'
export type BetweenCondition = NonLogicalCondition &
  Extract<AnySchemaCondition<string, string>, Record<BetweenOperator, unknown>>

type IsBetweenConditionAsserter = (condition: SchemaCondition) => condition is BetweenCondition

export const isBetweenCondition: IsBetweenConditionAsserter = (
  condition
): condition is BetweenCondition => 'between' in condition
