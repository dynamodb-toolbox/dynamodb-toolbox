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
import type { $Attribute } from './types/attribute'

export type FreezeAttribute<_ATTRIBUTE extends $Attribute> = _ATTRIBUTE extends $AnyAttribute
  ? FreezeAnyAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends $ConstantAttribute
  ? FreezeConstantAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends $PrimitiveAttribute
  ? FreezePrimitiveAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends $SetAttribute
  ? FreezeSetAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends $ListAttribute
  ? FreezeListAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends $ListAttribute
  ? FreezeListAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends $MapAttribute
  ? FreezeMapAttribute<_ATTRIBUTE>
  : never

/**
 * Validates an attribute definition
 *
 * @param attribute Attribute
 * @param path _(optional)_ Path of the attribute in the related item (string)
 * @return Attribute
 */
export const freezeAttribute = <_ATTRIBUTE extends $Attribute>(
  attribute: _ATTRIBUTE,
  path: string
): FreezeAttribute<_ATTRIBUTE> => {
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
  }
}
