/** Resolve to `true` if either `BOOL_A` or `BOOL_B` is `true`, `false` otherwise. */
export type Or<BOOL_A extends boolean, BOOL_B extends boolean> = BOOL_A extends true
  ? true
  : BOOL_B extends true
    ? true
    : false
