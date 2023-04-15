import type {
  Attribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute
} from 'v1/item'

import type { AnyAttributePutItem } from './any'
import type { PrimitiveAttributePutItem } from './primitive'
import type { SetAttributePutItem } from './set'
import type { ListAttributePutItem } from './list'
import type { MapAttributePutItem } from './map'
import type { RecordAttributePutItem } from './record'
import type { AnyOfAttributePutItem } from './anyOf'

export type AttributePutItem<ATTRIBUTE extends Attribute> = ATTRIBUTE extends AnyAttribute
  ? AnyAttributePutItem<ATTRIBUTE>
  : ATTRIBUTE extends PrimitiveAttribute
  ? PrimitiveAttributePutItem<ATTRIBUTE>
  : ATTRIBUTE extends SetAttribute
  ? SetAttributePutItem<ATTRIBUTE>
  : ATTRIBUTE extends ListAttribute
  ? ListAttributePutItem<ATTRIBUTE>
  : ATTRIBUTE extends MapAttribute
  ? MapAttributePutItem<ATTRIBUTE>
  : ATTRIBUTE extends RecordAttribute
  ? RecordAttributePutItem<ATTRIBUTE>
  : ATTRIBUTE extends AnyOfAttribute
  ? AnyOfAttributePutItem<ATTRIBUTE>
  : never
