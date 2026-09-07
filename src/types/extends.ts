/** Resolve to `true` if `LEFT` extends `RIGHT`, `false` otherwise (a `never` `LEFT` yields `false`). */
export type Extends<LEFT, RIGHT> = [LEFT] extends [never]
  ? false
  : LEFT extends RIGHT
    ? true
    : false

/** String variant of `Extends`, resolving to `'true'` or `'false'`. */
export type ExtendsStr<LEFT, RIGHT> = [LEFT] extends [never]
  ? 'false'
  : LEFT extends RIGHT
    ? 'true'
    : 'false'
