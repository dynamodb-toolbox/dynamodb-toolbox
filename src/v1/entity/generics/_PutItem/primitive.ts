import type { _PrimitiveAttribute } from 'v1/item'
import type { $resolved, $required } from 'v1/item/attributes/constants/symbols'

export type _PrimitiveAttributePutItem<
  _PRIMITIVE_ATTRIBUTE extends _PrimitiveAttribute
> = _PRIMITIVE_ATTRIBUTE extends { [$required]: 'never' }
  ? undefined | NonNullable<_PRIMITIVE_ATTRIBUTE[$resolved]>
  : NonNullable<_PRIMITIVE_ATTRIBUTE[$resolved]>
