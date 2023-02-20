import type { $AnyOfAttribute, $elements, $required } from 'v1/item'

import type { $AttributePutItem } from './attribute'

export type $AnyOfAttributePutItem<
  $ANY_OF_ATTRIBUTE extends $AnyOfAttribute
> = $ANY_OF_ATTRIBUTE extends {
  [$required]: 'never'
}
  ? undefined | $AttributePutItem<$ANY_OF_ATTRIBUTE[$elements][number]>
  : $AttributePutItem<$ANY_OF_ATTRIBUTE[$elements][number]>
