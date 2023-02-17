import { $type } from './constants/attributeOptions'
import { freezeAnyAttribute, $AnyAttribute, FreezeAnyAttribute } from './any'
import { freezeConstantAttribute, $ConstantAttribute, FreezeConstantAttribute } from './constant'
import {
  freezePrimitiveAttribute,
  $PrimitiveAttribute,
  FreezePrimitiveAttribute
} from './primitive'
import { freezeSetAttribute, $SetAttribute, FreezeSetAttribute } from './set'
import { freezeListAttribute, $ListAttribute, FreezeListAttribute } from './list'
import { freezeMapAttribute, $MapAttribute, FreezeMapAttribute } from './map'
import { freezeRecordAttribute, $RecordAttribute, FreezeRecordAttribute } from './record'
import { freezeAnyOfAttribute, $AnyOfAttribute, FreezeAnyOfAttribute } from './anyOf'
import type { $Attribute } from './types/attribute'

export type FreezeAttribute<$ATTRIBUTE extends $Attribute> = $ATTRIBUTE extends $AnyAttribute
  ? FreezeAnyAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $ConstantAttribute
  ? FreezeConstantAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $PrimitiveAttribute
  ? FreezePrimitiveAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $SetAttribute
  ? FreezeSetAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $ListAttribute
  ? FreezeListAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $MapAttribute
  ? FreezeMapAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $RecordAttribute
  ? FreezeRecordAttribute<$ATTRIBUTE>
  : $ATTRIBUTE extends $AnyOfAttribute
  ? FreezeAnyOfAttribute<$ATTRIBUTE>
  : never

/**
 * Validates an attribute definition
 *
 * @param attribute Attribute
 * @param path _(optional)_ Path of the attribute in the related item (string)
 * @return Attribute
 */
export const freezeAttribute = <$ATTRIBUTE extends $Attribute>(
  attribute: $ATTRIBUTE,
  path: string
): FreezeAttribute<$ATTRIBUTE> => {
  switch (attribute[$type]) {
    case 'any':
      return freezeAnyAttribute(attribute, path) as any
    case 'constant':
      return freezeConstantAttribute(attribute, path) as any
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
