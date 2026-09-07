import type { ComputeObject } from './computeObject.js'

/** Make the `KEYS` properties of `OBJECT` optional, leaving the rest unchanged. */
export type Optional<OBJECT extends object, KEYS extends string | number | symbol> = ComputeObject<
  { [KEY in Exclude<keyof OBJECT, KEYS>]: OBJECT[KEY] } & {
    [KEY in Extract<keyof OBJECT, KEYS>]?: OBJECT[KEY]
  }
>
