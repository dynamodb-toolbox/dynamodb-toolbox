import { validateAnyAttribute } from './any'
import { validateLeafAttribute } from './leaf'
import { validateSetAttribute } from './set'
import { validateListAttribute } from './list'
import { validateMapAttribute } from './map'
import type { Attribute } from './types/attribute'

/**
 * Validates an attribute definition
 *
 * @param attribute Attribute
 * @param path _(optional)_ Path of the attribute in the related item (string)
 * @return void
 */
export const validateAttribute = <AttributeInput extends Attribute>(
  attribute: AttributeInput,
  path?: string
): void => {
  switch (attribute._type) {
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return validateLeafAttribute(attribute, path)
    case 'set':
      return validateSetAttribute(attribute, path)
    case 'list':
      return validateListAttribute(attribute, path)
    case 'map':
      return validateMapAttribute(attribute, path)
    case 'any':
      return validateAnyAttribute(attribute, path)
  }
}
