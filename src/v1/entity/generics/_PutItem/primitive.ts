import type { _PrimitiveAttribute } from 'v1/item'

export type _PrimitiveAttributePutItem<
  _PRIMITIVE_ATTRIBUTE extends _PrimitiveAttribute
> = _PRIMITIVE_ATTRIBUTE extends { _required: 'never' }
  ? undefined | NonNullable<_PRIMITIVE_ATTRIBUTE['_resolved']>
  : NonNullable<_PRIMITIVE_ATTRIBUTE['_resolved']>
