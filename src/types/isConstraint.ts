import type { Keep } from './keep.js'

// CONSTRAINTS might be a union of constraints
// `extends` applies in parallel to all the union elements, so the results might be `true | false => boolean`
// We want to check if TYPE extends all of them so we need a double check
export type IsConstraint<TYPE extends CONSTRAINTS, CONSTRAINTS extends object> = (
  CONSTRAINTS extends Keep<TYPE, keyof CONSTRAINTS> ? true : false
) extends true
  ? true
  : false
