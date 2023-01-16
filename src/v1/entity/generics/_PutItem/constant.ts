import type { ResolvedAttribute, _ConstantAttribute } from 'v1/item'

export type _ConstantAttributePutItem<
  _CONSTANT_ATTRIBUTE extends _ConstantAttribute
> = _CONSTANT_ATTRIBUTE extends {
  _required: 'never'
}
  ? undefined | _CONSTANT_ATTRIBUTE['_value']
  : _CONSTANT_ATTRIBUTE['_value']
