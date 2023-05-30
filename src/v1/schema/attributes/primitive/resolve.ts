import type { $type, $enum } from '../constants/attributeOptions'

import type { $PrimitiveAttribute, PrimitiveAttribute } from './interface'
import type { ResolvePrimitiveAttributeType } from './types'

export type $ResolvePrimitiveAttribute<
  $ATTRIBUTE extends $PrimitiveAttribute
> = $ATTRIBUTE[$enum] extends ResolvePrimitiveAttributeType<$ATTRIBUTE[$type]>[]
  ? $ATTRIBUTE[$enum][number]
  : ResolvePrimitiveAttributeType<$ATTRIBUTE[$type]>

export type ResolvePrimitiveAttribute<
  ATTRIBUTE extends PrimitiveAttribute
> = ATTRIBUTE['enum'] extends ResolvePrimitiveAttributeType<ATTRIBUTE['type']>[]
  ? ATTRIBUTE['enum'][number]
  : ResolvePrimitiveAttributeType<ATTRIBUTE['type']>
