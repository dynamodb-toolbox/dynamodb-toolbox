import type { If, IsConstraint } from 'v1/types'

import type { AtLeastOnce, Always } from '../constants'
import type { AnyAttribute, ResolveAnyAttribute } from '../any'
import type { PrimitiveAttribute, ResolvePrimitiveAttribute } from '../primitive'
import type { SetAttribute, ResolveSetAttribute } from '../set'
import type { ListAttribute, ResolveListAttribute } from '../list'
import type { MapAttribute, ResolveMapAttribute } from '../map'
import type { RecordAttribute, ResolveRecordAttribute } from '../record'
import type { AnyOfAttribute, ResolveAnyOfAttribute } from '../anyOf'

import type { Attribute } from './attribute'

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  OPTIONS extends { key: boolean } = { key: false }
> = ATTRIBUTE extends {
  required: AtLeastOnce | Always
}
  ? true
  : false

export type ResolveAttribute<
  ATTRIBUTE extends Attribute,
  OPTIONS extends { key: boolean } = { key: false }
> = If<
  IsConstraint<Attribute, ATTRIBUTE>,
  unknown,
  | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
  | (ATTRIBUTE extends AnyAttribute
      ? ResolveAnyAttribute<ATTRIBUTE, OPTIONS>
      : ATTRIBUTE extends PrimitiveAttribute
      ? ResolvePrimitiveAttribute<ATTRIBUTE, OPTIONS>
      : ATTRIBUTE extends SetAttribute
      ? ResolveSetAttribute<ATTRIBUTE, OPTIONS>
      : ATTRIBUTE extends ListAttribute
      ? ResolveListAttribute<ATTRIBUTE, OPTIONS>
      : ATTRIBUTE extends MapAttribute
      ? ResolveMapAttribute<ATTRIBUTE, OPTIONS>
      : ATTRIBUTE extends RecordAttribute
      ? ResolveRecordAttribute<ATTRIBUTE, OPTIONS>
      : ATTRIBUTE extends AnyOfAttribute
      ? ResolveAnyOfAttribute<ATTRIBUTE, OPTIONS>
      : never)
>
