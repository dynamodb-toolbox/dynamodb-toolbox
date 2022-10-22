import { freezeAnyAttribute, AnyAttribute, FreezeAnyAttribute } from './any'
import { freezeLeafAttribute, LeafAttribute, FreezeLeafAttribute } from './leaf'
import { freezeSetAttribute, SetAttribute, FreezeSetAttribute } from './set'
import { freezeListAttribute, ListAttribute, FreezeListAttribute } from './list'
import { freezeMapAttribute, MapAttribute, FreezeMapAttribute } from './map'
import type { Attribute } from './types/attribute'

export type FreezeAttribute<AttributeInput extends Attribute> = AttributeInput extends AnyAttribute
  ? FreezeAnyAttribute<AttributeInput>
  : AttributeInput extends LeafAttribute
  ? FreezeLeafAttribute<AttributeInput>
  : AttributeInput extends SetAttribute
  ? FreezeSetAttribute<AttributeInput>
  : AttributeInput extends ListAttribute
  ? FreezeListAttribute<AttributeInput>
  : AttributeInput extends ListAttribute
  ? FreezeListAttribute<AttributeInput>
  : AttributeInput extends MapAttribute
  ? FreezeMapAttribute<AttributeInput>
  : never

/**
 * Validates an attribute definition
 *
 * @param attribute Attribute
 * @param path _(optional)_ Path of the attribute in the related item (string)
 * @return FrozenAttribute
 */
export const freezeAttribute = <AttributeInput extends Attribute>(
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
