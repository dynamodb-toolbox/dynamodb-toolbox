import { freezeAnyAttribute, _AnyAttribute, FreezeAnyAttribute } from './any'
import { freezeLeafAttribute, _LeafAttribute, FreezeLeafAttribute } from './leaf'
import { freezeSetAttribute, _SetAttribute, FreezeSetAttribute } from './set'
import { freezeListAttribute, _ListAttribute, FreezeListAttribute } from './list'
import { freezeMapAttribute, _MapAttribute, FreezeMapAttribute } from './map'
import type { _Attribute } from './types/attribute'

export type FreezeAttribute<
  AttributeInput extends _Attribute
> = AttributeInput extends _AnyAttribute
  ? FreezeAnyAttribute<AttributeInput>
  : AttributeInput extends _LeafAttribute
  ? FreezeLeafAttribute<AttributeInput>
  : AttributeInput extends _SetAttribute
  ? FreezeSetAttribute<AttributeInput>
  : AttributeInput extends _ListAttribute
  ? FreezeListAttribute<AttributeInput>
  : AttributeInput extends _ListAttribute
  ? FreezeListAttribute<AttributeInput>
  : AttributeInput extends _MapAttribute
  ? FreezeMapAttribute<AttributeInput>
  : never

/**
 * Validates an attribute definition
 *
 * @param attribute Attribute
 * @param path _(optional)_ Path of the attribute in the related item (string)
 * @return FrozenAttribute
 */
export const freezeAttribute = <AttributeInput extends _Attribute>(
  attribute: AttributeInput,
  path: string
): FreezeAttribute<AttributeInput> => {
  switch (attribute._type) {
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return freezeLeafAttribute(attribute, path) as any
    case 'set':
      return freezeSetAttribute(attribute, path) as any
    case 'list':
      return freezeListAttribute(attribute, path) as any
    case 'map':
      return freezeMapAttribute(attribute, path) as any
    case 'any':
      return freezeAnyAttribute(attribute, path) as any
  }
}
