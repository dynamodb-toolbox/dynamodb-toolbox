import type { _ConstantAttribute } from 'v1/item'
import type { $value, $required } from 'v1/item/attributes/constants/symbols'

export type _ConstantAttributePutItem<
  _CONSTANT_ATTRIBUTE extends _ConstantAttribute
> = _CONSTANT_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | _CONSTANT_ATTRIBUTE[$value]
  : _CONSTANT_ATTRIBUTE[$value]
