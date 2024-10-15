/**
 * Update the fields of `OBJECT_A` with the ones of `OBJECT_B`
 *
 * (Only the existing fields are updated)
 */
export type Overwrite<OBJECT_A extends object, OBJECT_B extends object> = {
  [KEY in keyof OBJECT_A]: KEY extends keyof OBJECT_B ? OBJECT_B[KEY] : OBJECT_A[KEY]
} & {}

export type ConstrainedOverwrite<
  CONSTRAINT extends object,
  OBJECT_A extends CONSTRAINT,
  OBJECT_B extends Partial<CONSTRAINT>
> = {
  [KEY in keyof CONSTRAINT]: OBJECT_B extends { [K in KEY]: CONSTRAINT[KEY] }
    ? OBJECT_B[KEY]
    : OBJECT_A[KEY]
} & {}
