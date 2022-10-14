import type { MapAttributeAttributes, Narrow } from './attributes/types'
import { validateAttribute } from './attributes/validate'

import type { Item } from './interface'

type ItemTyper = <MapAttributeAttributesInput extends MapAttributeAttributes = {}>(
  _attributes: Narrow<MapAttributeAttributesInput>
) => Item<MapAttributeAttributesInput>

// TODO: Enable item opening
/**
 * Defines an Entity items shape
 *
 * @param attributes Object of attributes
 * @return Item
 */
export const item: ItemTyper = <MapAttributeAttributesInput extends MapAttributeAttributes = {}>(
  attributes: Narrow<MapAttributeAttributesInput>
): Item<MapAttributeAttributesInput> => {
  // Validation is run at item definition only
  // This avoids unnecessary compute and bugs (validating incomplete items)
  Object.entries(attributes).forEach(([attributeName, attribute]) => {
    validateAttribute(attribute, attributeName)
  })

  return {
    _type: 'item',
    _open: false,
    _attributes: attributes
  } as Item<MapAttributeAttributesInput>
}
