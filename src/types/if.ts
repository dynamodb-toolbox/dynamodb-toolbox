export type If<CONDITION extends boolean | undefined, THEN, ELSE = never> = CONDITION extends true
  ? THEN
  : ELSE
