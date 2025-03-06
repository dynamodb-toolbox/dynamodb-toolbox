import type { ComputeObject } from './computeObject.js'

/**
 * Update the fields of `OBJECT_A` with the ones of `OBJECT_B`
 */
export type Overwrite<OBJECT_A extends object, OBJECT_B extends object> = ComputeObject<{
  [KEY in keyof OBJECT_A | keyof OBJECT_B]: KEY extends keyof OBJECT_B
    ? OBJECT_B[KEY]
    : KEY extends keyof OBJECT_A
      ? OBJECT_A[KEY]
      : never
}>
