/** Negate a boolean type: `true` becomes `false` and vice versa. */
export type Not<BOOL extends boolean> = BOOL extends true
  ? false
  : BOOL extends false
    ? true
    : never
