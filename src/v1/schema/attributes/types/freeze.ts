import type { $AnyAttributeState, FreezeAnyAttribute } from '../any'
import type { $PrimitiveAttributeState, FreezePrimitiveAttribute } from '../primitive'
import type { $SetAttributeState, FreezeSetAttribute } from '../set'
import type { $ListAttributeState, FreezeListAttribute } from '../list'
import type { $MapAttributeState, FreezeMapAttribute } from '../map'
import type { $RecordAttributeState, FreezeRecordAttribute } from '../record'
import type { $AnyOfAttributeState, FreezeAnyOfAttribute } from '../anyOf'
import type { $AttributeState } from '../types'

export type FreezeAttribute<
  $ATTRIBUTE extends $AttributeState
> = $ATTRIBUTE extends $AnyAttributeState
  ? FreezeAnyAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $PrimitiveAttributeState
  ? FreezePrimitiveAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $SetAttributeState
  ? FreezeSetAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $ListAttributeState
  ? FreezeListAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $MapAttributeState
  ? FreezeMapAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $RecordAttributeState
  ? FreezeRecordAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $AnyOfAttributeState
  ? FreezeAnyOfAttribute<$ATTRIBUTE>
  : never
