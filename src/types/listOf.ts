import type { Cast } from './cast.js'
import type { Extends } from './extends.js'

type IntersectOf<UNION> = (UNION extends unknown ? (arg: UNION) => void : never) extends (
  arg: infer INTERSECTION
) => void
  ? INTERSECTION
  : never

type Last<UNION> =
  IntersectOf<UNION extends unknown ? (arg: UNION) => void : never> extends (
    arg: infer LAST_ELEMENT
  ) => void
    ? LAST_ELEMENT
    : never

type ListOfRec<UNION, RESULTS extends ReadonlyArray<any> = [], LAST_ELEMENT = Last<UNION>> =
  Extends<[UNION], [never]> extends true
    ? RESULTS
    : ListOfRec<Exclude<UNION, LAST_ELEMENT>, [LAST_ELEMENT, ...RESULTS]>

/**
 * Transform a Union into a List
 *
 * (⚠️ it might not preserve order)
 */
export type ListOf<UNION> =
  ListOfRec<UNION> extends infer ELEMENT ? Cast<ELEMENT, ReadonlyArray<any>> : never
