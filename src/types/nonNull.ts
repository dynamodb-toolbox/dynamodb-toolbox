import type { Merge } from './merge.js'

type NonNullValues<O> = {
  [K in keyof O]: Exclude<O[K], undefined | null>
} & {}

/**
 * Make some fields of `O` not nullable (deeply or not)
 * (Optional fields will be left untouched & `undefined`)
 */
export type NonNull<OBJECT extends object, KEYS extends keyof OBJECT = keyof OBJECT> = Merge<
  Omit<OBJECT, KEYS>,
  NonNullValues<Pick<OBJECT, KEYS>>
>
