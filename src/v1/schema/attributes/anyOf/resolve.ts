import type { Attribute, ResolveAttribute } from '../types'
import type { AnyOfAttribute } from './interface'

export type ResolveAnyOfAttribute<ATTRIBUTE extends AnyOfAttribute> = ResolveAnyOfAttributeRec<
  ATTRIBUTE['elements']
>

type ResolveAnyOfAttributeRec<ELEMENTS extends Attribute[], RESULTS = never> = ELEMENTS extends [
  infer ELEMENTS_HEAD,
  ...infer ELEMENTS_TAIL
]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? ResolveAnyOfAttributeRec<ELEMENTS_TAIL, RESULTS | ResolveAttribute<ELEMENTS_HEAD>>
      : never
    : never
  : [RESULTS] extends [never]
  ? unknown
  : RESULTS
