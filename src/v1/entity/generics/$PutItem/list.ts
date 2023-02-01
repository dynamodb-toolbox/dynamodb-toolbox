import type { $ListAttribute } from 'v1/item'
import type { $elements, $required } from 'v1/item/attributes/constants/attributeOptions'

import type { $AttributePutItem } from './attribute'

export type $ListAttributePutItem<
  $LIST_ATTRIBUTE extends $ListAttribute
> = $LIST_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | $AttributePutItem<$LIST_ATTRIBUTE[$elements]>[]
  : $AttributePutItem<$LIST_ATTRIBUTE[$elements]>[]
