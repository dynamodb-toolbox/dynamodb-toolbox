/** Cast `VALUE` to `CONSTRAINT`, keeping `VALUE` when it already satisfies the constraint. */
export type Cast<VALUE, CONSTRAINT> = VALUE extends CONSTRAINT ? VALUE : CONSTRAINT
