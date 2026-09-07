import type { Writable } from '~/types/writable.js'

type Writabler = <OBJ extends object>(obj: OBJ) => Writable<OBJ>

/** Identity function that widens an object to its `Writable` (mutable) type. */
export const writable: Writabler = obj => obj
