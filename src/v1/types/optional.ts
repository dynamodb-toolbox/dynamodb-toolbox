import type { ComputeObject } from './computeObject'

export type Optional<OBJECT extends Record<string, unknown>, KEYS extends string> = ComputeObject<
  { [KEY in Exclude<keyof OBJECT, KEYS & string>]: OBJECT[KEY] } &
    { [KEY in Extract<keyof OBJECT, KEYS & string>]?: OBJECT[KEY] | undefined }
>
