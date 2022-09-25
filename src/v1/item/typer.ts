import type { MappedAttributes, Narrow } from './typers/types'
import { validateAttribute } from './typers/validate'

import type { Item } from './interface'

type ItemTyper = <MappedAttributesInput extends MappedAttributes = {}>(
  _attributes: Narrow<MappedAttributesInput>
) => Item<MappedAttributesInput>

// TODO: Enable item opening
/**
 * Defines an Entity items shape
 *
 * @param attributes Object of attributes
 * @return Item
 */
export const item: ItemTyper = <MappedAttributesInput extends MappedAttributes = {}>(
  attributes: Narrow<MappedAttributesInput>
): Item<MappedAttributesInput> => {
  // Validation is run at item definition only
  // This avoids unnecessary compute and bugs (validating incomplete items)
  Object.entries(attributes).forEach(([attributeName, attribute]) => {
    validateAttribute(attribute, attributeName)
  })

  return {
    _type: 'item',
    _open: false,
    _attributes: attributes
  } as Item<MappedAttributesInput>
}
