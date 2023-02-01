import type {
  ComputedDefault,
  $Attribute,
  $AnyAttribute,
  $ConstantAttribute,
  $PrimitiveAttribute,
  $SetAttribute,
  $ListAttribute,
  $MapAttribute
} from 'v1/item'
import { $default } from 'v1/item/attributes/constants/attributeOptions'

import type { $AttributePutItem } from '../$PutItem'

import type { $ListAttributePutDefaultsComputer } from './list'
import type { $MapAttributePutDefaultsComputer } from './map'

export type $AttributePutDefaultsComputer<
  $ATTRIBUTE extends $Attribute,
  CONTEXT_INPUTS extends any[]
> = $ATTRIBUTE extends (
  | $AnyAttribute
  | $ConstantAttribute
  | $PrimitiveAttribute
  | $SetAttribute
) & { [$default]: ComputedDefault }
  ? (...contextInputs: CONTEXT_INPUTS) => $AttributePutItem<$ATTRIBUTE>
  : $ATTRIBUTE extends $ListAttribute
  ? $ListAttributePutDefaultsComputer<$ATTRIBUTE, CONTEXT_INPUTS>
  : $ATTRIBUTE extends $MapAttribute
  ? $MapAttributePutDefaultsComputer<$ATTRIBUTE, CONTEXT_INPUTS>
  : undefined
