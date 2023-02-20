import { $PrimitiveAttribute, $ResolvePrimitiveAttribute, $required } from 'v1/item'

export type $PrimitiveAttributePutItem<
  $PRIMITIVE_ATTRIBUTE extends $PrimitiveAttribute
> = $PRIMITIVE_ATTRIBUTE extends { [$required]: 'never' }
  ? undefined | $ResolvePrimitiveAttribute<$PRIMITIVE_ATTRIBUTE>
  : $ResolvePrimitiveAttribute<$PRIMITIVE_ATTRIBUTE>
