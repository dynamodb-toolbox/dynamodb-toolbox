import { $PrimitiveAttribute, $ResolvePrimitiveAttribute } from 'v1/item'
import type { $required } from 'v1/item/attributes/constants/attributeOptions'

export type $PrimitiveAttributePutItem<
  $PRIMITIVE_ATTRIBUTE extends $PrimitiveAttribute
> = $PRIMITIVE_ATTRIBUTE extends { [$required]: 'never' }
  ? undefined | $ResolvePrimitiveAttribute<$PRIMITIVE_ATTRIBUTE>
  : $ResolvePrimitiveAttribute<$PRIMITIVE_ATTRIBUTE>
