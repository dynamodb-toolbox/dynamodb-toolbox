import type { Overwrite } from '~/types/overwrite.js'

type Overwriter = <OBJECT_A extends object, OBJECT_B extends object>(
  objectA: OBJECT_A,
  objectB: OBJECT_B
) => Overwrite<OBJECT_A, OBJECT_B>

export const overwrite: Overwriter = <OBJECT_A extends object, OBJECT_B extends object>(
  objectA: OBJECT_A,
  objectB: OBJECT_B
) => ({ ...objectA, ...objectB }) as Overwrite<OBJECT_A, OBJECT_B>
