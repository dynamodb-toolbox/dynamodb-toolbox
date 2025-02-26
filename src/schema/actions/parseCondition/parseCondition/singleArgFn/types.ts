import type { AnySchemaCondition, NonLogicalCondition, SchemaCondition } from '../../condition.js'

export type SingleArgFnCondition = NonLogicalCondition &
  Extract<AnySchemaCondition<string, string>, { exists: unknown }>

type SingleArgFnConditionAsserter = (
  condition: SchemaCondition
) => condition is SingleArgFnCondition

export const isSingleArgFnCondition: SingleArgFnConditionAsserter = (
  condition
): condition is SingleArgFnCondition => 'exists' in condition
