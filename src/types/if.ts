/** Resolve to `THEN` when `CONDITION` is `true`, otherwise to `ELSE`. */
export type If<CONDITION extends boolean | undefined, THEN, ELSE = never> = CONDITION extends true
  ? THEN
  : ELSE
