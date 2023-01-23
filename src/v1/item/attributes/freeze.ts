import { $type } from './constants/symbols'
import { freezeAnyAttribute, _AnyAttribute, FreezeAnyAttribute } from './any'
import { freezeConstantAttribute, _ConstantAttribute, FreezeConstantAttribute } from './constant'
import {
  freezePrimitiveAttribute,
  _PrimitiveAttribute,
  FreezePrimitiveAttribute
} from './primitive'
import { freezeSetAttribute, _SetAttribute, FreezeSetAttribute } from './set'
import { freezeListAttribute, _ListAttribute, FreezeListAttribute } from './list'
import { freezeMapAttribute, _MapAttribute, FreezeMapAttribute } from './map'
import type { _Attribute } from './types/attribute'

export type FreezeAttribute<_ATTRIBUTE extends _Attribute> = _ATTRIBUTE extends _AnyAttribute
  ? FreezeAnyAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends _ConstantAttribute
  ? FreezeConstantAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends _PrimitiveAttribute
  ? FreezePrimitiveAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends _SetAttribute
  ? FreezeSetAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends _ListAttribute
  ? FreezeListAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends _ListAttribute
  ? FreezeListAttribute<_ATTRIBUTE>
  : _ATTRIBUTE extends _MapAttribute
  ? FreezeMapAttribute<_ATTRIBUTE>
  : never

/**
 * Validates an attribute definition
 *
 * @param attribute Attribute
 * @param path _(optional)_ Path of the attribute in the related item (string)
 * @return Attribute
 */
export const freezeAttribute = <_ATTRIBUTE extends _Attribute>(
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
