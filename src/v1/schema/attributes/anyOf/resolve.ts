import type { Attribute, ResolveAttribute } from '../types'
import type { AnyOfAttribute } from './interface'

export type ResolveAnyOfAttribute<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends { key: boolean } = { key: false }
> = ResolveAnyOfAttributeRec<ATTRIBUTE['elements'], OPTIONS>

export type ResolveAnyOfAttributeRec<
  ELEMENTS extends Attribute[],
  OPTIONS extends { key: boolean } = { key: false },
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? ResolveAnyOfAttributeRec<
          ELEMENTS_TAIL,
          OPTIONS,
          RESULTS | ResolveAttribute<ELEMENTS_HEAD, OPTIONS>
        >
      : never
    : never
  : [RESULTS] extends [never]
  ? unknown
  : RESULTS
