import type { $ConstantAttribute, $ResolveConstantAttribute } from 'v1/item'
import type { $required } from 'v1/item/attributes/constants/attributeOptions'

export type $ConstantAttributePutItem<
  $CONSTANT_ATTRIBUTE extends $ConstantAttribute
> = $CONSTANT_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | $ResolveConstantAttribute<$CONSTANT_ATTRIBUTE>
  : $ResolveConstantAttribute<$CONSTANT_ATTRIBUTE>
