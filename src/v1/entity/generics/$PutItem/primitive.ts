import type { ResolvePrimitiveAttributeType, $PrimitiveAttribute } from 'v1/item'
import type { $type, $required, $enum } from 'v1/item/attributes/constants/attributeOptions'

export type $PrimitiveAttributePutItem<
  $PRIMITIVE_ATTRIBUTE extends $PrimitiveAttribute
> = $PRIMITIVE_ATTRIBUTE extends { [$required]: 'never' }
  ?
      | undefined
      | ($PRIMITIVE_ATTRIBUTE[$enum] extends ResolvePrimitiveAttributeType<
          $PRIMITIVE_ATTRIBUTE[$type]
        >[]
          ? $PRIMITIVE_ATTRIBUTE[$enum][number]
          : ResolvePrimitiveAttributeType<$PRIMITIVE_ATTRIBUTE[$type]>)
  : $PRIMITIVE_ATTRIBUTE[$enum] extends ResolvePrimitiveAttributeType<$PRIMITIVE_ATTRIBUTE[$type]>[]
  ? $PRIMITIVE_ATTRIBUTE[$enum][number]
  : ResolvePrimitiveAttributeType<$PRIMITIVE_ATTRIBUTE[$type]>
