import { $type } from './constants/attributeOptions'
import { freezeAnyAttribute, $AnyAttributeState, FreezeAnyAttribute } from './any'
import {
  freezePrimitiveAttribute,
  $PrimitiveAttributeState,
  FreezePrimitiveAttribute
} from './primitive'
import { freezeSetAttribute, $SetAttributeState, FreezeSetAttribute } from './set'
import { freezeListAttribute, $ListAttributeState, FreezeListAttribute } from './list'
import { freezeMapAttribute, $MapAttributeState, FreezeMapAttribute } from './map'
import { freezeRecordAttribute, $RecordAttributeState, FreezeRecordAttribute } from './record'
import { freezeAnyOfAttribute, $AnyOfAttributeState, FreezeAnyOfAttribute } from './anyOf'
import type { $AttributeState } from './types/attribute'

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

/**
 * Validates an attribute definition
 *
 * @param attribute Attribute
 * @param path _(optional)_ Path of the attribute in the related schema (string)
 * @return Attribute
 */
export const freezeAttribute = <$ATTRIBUTE extends $AttributeState>(
  attribute: $ATTRIBUTE,
  path: string
): FreezeAttribute<$ATTRIBUTE> => {
  switch (attribute[$type]) {
    case 'any':
      return freezeAnyAttribute(attribute, path) as any
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return freezePrimitiveAttribute(attribute, path) as any
    case 'set':
      return freezeSetAttribute(attribute, path) as any
    case 'list':
      return freezeListAttribute(attribute, path) as any
    case 'map':
      return freezeMapAttribute(attribute, path) as any
    case 'record':
      return freezeRecordAttribute(attribute, path) as any
    case 'anyOf':
      return freezeAnyOfAttribute(attribute, path) as any
  }
}
