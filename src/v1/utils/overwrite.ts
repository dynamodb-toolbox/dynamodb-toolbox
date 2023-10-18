import type { O } from 'ts-toolbelt'

export const overwrite = <OBJECT_A extends object, OBJECT_B extends object>(
  objectA: OBJECT_A,
  objectB: OBJECT_B
): O.Overwrite<OBJECT_A, OBJECT_B> =>
  ({ ...objectA, ...objectB } as O.Overwrite<OBJECT_A, OBJECT_B>)
