import type { Writable } from '~/types/writable.js'

type Writabler = <OBJ extends object>(obj: OBJ) => Writable<OBJ>

export const writable: Writabler = obj => obj
