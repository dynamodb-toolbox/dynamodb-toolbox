import type { ResolvePrimitiveAttributeType, _PrimitiveAttribute } from 'v1/item'
import type { $type, $required, $enum } from 'v1/item/attributes/constants/attributeOptions'

export type _PrimitiveAttributePutItem<
  _PRIMITIVE_ATTRIBUTE extends _PrimitiveAttribute
> = _PRIMITIVE_ATTRIBUTE extends { [$required]: 'never' }
  ?
      | undefined
      | (_PRIMITIVE_ATTRIBUTE[$enum] extends ResolvePrimitiveAttributeType<
          _PRIMITIVE_ATTRIBUTE[$type]
        >[]
          ? _PRIMITIVE_ATTRIBUTE[$enum][number]
          : ResolvePrimitiveAttributeType<_PRIMITIVE_ATTRIBUTE[$type]>)
  : _PRIMITIVE_ATTRIBUTE[$enum] extends ResolvePrimitiveAttributeType<_PRIMITIVE_ATTRIBUTE[$type]>[]
  ? _PRIMITIVE_ATTRIBUTE[$enum][number]
  : ResolvePrimitiveAttributeType<_PRIMITIVE_ATTRIBUTE[$type]>
