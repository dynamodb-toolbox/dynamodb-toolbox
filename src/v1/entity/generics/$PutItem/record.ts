import type { $RecordAttribute, $ResolvePrimitiveAttribute } from 'v1/item'
import type { $keys, $elements, $required } from 'v1/item/attributes/constants/attributeOptions'

import type { $AttributePutItem } from './attribute'

export type $RecordAttributePutItem<
  $RECORD_ATTRIBUTE extends $RecordAttribute
> = $RECORD_ATTRIBUTE extends {
  [$required]: 'never'
}
  ?
      | undefined
      | {
          [KEY in $ResolvePrimitiveAttribute<$RECORD_ATTRIBUTE[$keys]>]: $AttributePutItem<
            $RECORD_ATTRIBUTE[$elements]
          >
        }
  : {
      [KEY in $ResolvePrimitiveAttribute<$RECORD_ATTRIBUTE[$keys]>]: $AttributePutItem<
        $RECORD_ATTRIBUTE[$elements]
      >
    }
