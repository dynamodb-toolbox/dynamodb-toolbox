import type { If } from '~/types/index.js'

/** Return `then` when `condition` is truthy, otherwise `els`, preserving the resolved type via `If`. */
export const ifThenElse = <CONDITION extends boolean | undefined, THEN, ELSE>(
  condition: CONDITION,
  then: THEN,
  els: ELSE
): If<CONDITION, THEN, ELSE> => (condition ? then : els) as If<CONDITION, THEN, ELSE>
