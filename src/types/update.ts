import type { ExtendsStr } from './extends'

type Replace<PREV_VALUE, CONSTRAINT, NEXT_VALUE> = {
  true: NEXT_VALUE
  false: PREV_VALUE
}[ExtendsStr<PREV_VALUE, CONSTRAINT>]

/**
 * Update in `OBJECT` the fields of key `KEYS` with `VALUE`.
 */
export type Update<OBJECT extends object, KEYS extends string | number | symbol, VALUE> = {
  [KEY in keyof OBJECT]: KEY extends KEYS ? Replace<VALUE, never, OBJECT[KEY]> : OBJECT[KEY]
} & {}
