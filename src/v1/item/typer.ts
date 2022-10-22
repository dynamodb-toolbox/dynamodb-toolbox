import type { MapAttributeAttributes, Narrow } from './attributes/types'
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
): Item<MapAttributeAttributesInput> =>
  ({
    _type: 'item',
    _open: false,
    _attributes: attributes
  } as Item<MapAttributeAttributesInput>)
