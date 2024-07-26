import type { Merge } from './merge.js'

/**
 * Make some properties of `OBJECT` required
 */
export type Require<OBJECT extends object, KEYS extends keyof OBJECT> = Merge<
  Omit<OBJECT, KEYS>,
  Required<Pick<OBJECT, KEYS>>
>
