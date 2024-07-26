/**
 * Update the fields of `OBJECT_A` with the ones of `OBJECT_B`
 *
 * (Only the existing fields will be updated)
 */
export type Overwrite<OBJECT_A extends object, OBJECT_B extends object> = {
  [KEY in keyof OBJECT_A]: KEY extends keyof OBJECT_B ? OBJECT_B[KEY] : OBJECT_A[KEY]
} & {}
