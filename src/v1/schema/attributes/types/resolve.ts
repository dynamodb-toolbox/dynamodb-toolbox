import type { If } from 'v1/types'

import type { AtLeastOnce, Always } from '../constants'
import type { AnyAttribute, ResolveAnyAttribute } from '../any'
import type { PrimitiveAttribute, ResolvePrimitiveAttribute } from '../primitive'
import type { SetAttribute, ResolveSetAttribute } from '../set'
import type { ListAttribute, ResolveListAttribute } from '../list'
import type { MapAttribute, ResolveMapAttribute } from '../map'
import type { RecordAttribute, ResolveRecordAttribute } from '../record'
import type { AnyOfAttribute, ResolveAnyOfAttribute } from '../anyOf'
import type { Attribute } from './attribute'

type MustBeDefined<ATTRIBUTE extends Attribute> = ATTRIBUTE extends {
  required: AtLeastOnce | Always
}
  ? true
  : false

export type ResolveAttribute<ATTRIBUTE extends Attribute> = Attribute extends Pick<
  ATTRIBUTE,
  keyof Attribute
>
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE>, never, undefined>
      | (ATTRIBUTE extends AnyAttribute
          ? ResolveAnyAttribute<ATTRIBUTE>
          : ATTRIBUTE extends PrimitiveAttribute
          ? ResolvePrimitiveAttribute<ATTRIBUTE>
          : ATTRIBUTE extends SetAttribute
          ? ResolveSetAttribute<ATTRIBUTE>
          : ATTRIBUTE extends ListAttribute
          ? ResolveListAttribute<ATTRIBUTE>
          : ATTRIBUTE extends MapAttribute
          ? ResolveMapAttribute<ATTRIBUTE>
          : ATTRIBUTE extends RecordAttribute
          ? ResolveRecordAttribute<ATTRIBUTE>
          : ATTRIBUTE extends AnyOfAttribute
          ? ResolveAnyOfAttribute<ATTRIBUTE>
          : never)
