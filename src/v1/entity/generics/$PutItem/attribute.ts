import type {
  $Attribute,
  $AnyAttribute,
  $ConstantAttribute,
  $PrimitiveAttribute,
  $SetAttribute,
  $ListAttribute,
  $MapAttribute,
  $AnyOfAttribute
} from 'v1/item'
import { $elements } from 'v1/item/attributes/constants/attributeOptions'

import type { $AnyAttributePutItem } from './any'
import type { $ConstantAttributePutItem } from './constant'
import type { $PrimitiveAttributePutItem } from './primitive'
import type { $SetAttributePutItem } from './set'
import type { $ListAttributePutItem } from './list'
import type { $MapAttributePutItem } from './map'

export type $AttributePutItem<$ATTRIBUTE extends $Attribute> = $ATTRIBUTE extends $AnyAttribute
  ? $AnyAttributePutItem<$ATTRIBUTE>
  : $ATTRIBUTE extends $ConstantAttribute
  ? $ConstantAttributePutItem<$ATTRIBUTE>
  : $ATTRIBUTE extends $PrimitiveAttribute
  ? $PrimitiveAttributePutItem<$ATTRIBUTE>
  : $ATTRIBUTE extends $SetAttribute
  ? $SetAttributePutItem<$ATTRIBUTE>
  : $ATTRIBUTE extends $ListAttribute
  ? $ListAttributePutItem<$ATTRIBUTE>
  : $ATTRIBUTE extends $MapAttribute
  ? $MapAttributePutItem<$ATTRIBUTE>
  : $ATTRIBUTE extends $AnyOfAttribute
  ? $AttributePutItem<$ATTRIBUTE[$elements][number]>
  : never
