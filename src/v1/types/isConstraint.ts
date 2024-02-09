export type IsConstraint<CONSTRAINT, TYPE extends CONSTRAINT> = CONSTRAINT extends Pick<
  TYPE,
  keyof CONSTRAINT
>
  ? true
  : false
