import type { O } from 'ts-toolbelt'

type Overwriter = <OBJECT_A extends object, OBJECT_B extends object>(
  objectA: OBJECT_A,
  objectB: OBJECT_B
) => O.Overwrite<OBJECT_A, OBJECT_B>

export const overwrite: Overwriter = <OBJECT_A extends object, OBJECT_B extends object>(
  objectA: OBJECT_A,
  objectB: OBJECT_B
) => ({ ...objectA, ...objectB } as O.Overwrite<OBJECT_A, OBJECT_B>)
