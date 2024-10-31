import type { ComputeObject } from './computeObject.js'

type OptionalKeys<OBJECT extends object> = {
  [KEY in keyof OBJECT]-?: {} extends Pick<OBJECT, KEY> ? KEY : never
}[keyof OBJECT]

type MergeValues<
  VALUE_A,
  VALUE_B,
  OPTIONAL_KEYS extends string | number | symbol,
  KEY extends string | number | symbol
> = KEY extends OPTIONAL_KEYS
  ? Exclude<VALUE_A, undefined> | VALUE_B
  : VALUE_A extends undefined
    ? VALUE_B
    : VALUE_A

type Anyfy<OBJECT extends object> = { [KEY in keyof OBJECT]: any }

/**
 * Accurately merge the fields of `OBJECT_A` with the ones of `OBJECT_B`.
 *
 * Optional fields are handled gracefully.
 */
export type Merge<
  OBJECT_A extends object,
  OBJECT_B extends object,
  OPTIONAL_KEYS extends string | number | symbol = OptionalKeys<OBJECT_A>
> = ComputeObject<{
  [KEY in keyof (Anyfy<OBJECT_A> & OBJECT_B)]: KEY extends keyof OBJECT_A
    ? KEY extends keyof OBJECT_B
      ? MergeValues<OBJECT_A[KEY], OBJECT_B[KEY], OPTIONAL_KEYS, KEY>
      : OBJECT_A[KEY]
    : KEY extends keyof OBJECT_B
      ? OBJECT_B[KEY]
      : never
}>
