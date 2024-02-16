import type { ComputeObject } from './computeObject'

export type Optional<OBJECT extends object, KEYS extends string> = ComputeObject<
  { [KEY in Exclude<keyof OBJECT, KEYS>]: OBJECT[KEY] } &
    { [KEY in Extract<keyof OBJECT, KEYS>]?: OBJECT[KEY] }
>
