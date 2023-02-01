import type { $ConstantAttribute } from 'v1/item'
import type { $value, $required } from 'v1/item/attributes/constants/attributeOptions'

export type $ConstantAttributePutItem<
  $CONSTANT_ATTRIBUTE extends $ConstantAttribute
> = $CONSTANT_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | $CONSTANT_ATTRIBUTE[$value]
  : $CONSTANT_ATTRIBUTE[$value]
