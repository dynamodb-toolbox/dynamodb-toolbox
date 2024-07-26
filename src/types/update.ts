/**
 * Update in `OBJECT` the fields of key `KEYS` with `VALUE`.
 */
export declare type Update<OBJECT extends object, KEYS extends string | number | symbol, VALUE> = {
  [KEY in keyof OBJECT]: KEY extends KEYS ? VALUE : OBJECT[KEY]
} & {}
