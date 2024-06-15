import type { AnyAttributeCondition, NonLogicalCondition, SchemaCondition } from '../../condition'

export type SingleArgFnCondition = NonLogicalCondition &
  Extract<AnyAttributeCondition<string, string>, { exists: unknown }>

export const isSingleArgFnCondition = (
  condition: SchemaCondition
): condition is SingleArgFnCondition => 'exists' in condition
