import type { $MapAttributeAttributes, Narrow } from './attributes'
import { $type, $attributes } from './attributes/constants/attributeOptions'
import type { $Item } from './interface'

type ItemTyper = <$MAP_ATTRIBUTE_ATTRIBUTES extends $MapAttributeAttributes = {}>(
  attributes: Narrow<$MAP_ATTRIBUTE_ATTRIBUTES>
) => $Item<$MAP_ATTRIBUTE_ATTRIBUTES>

/**
 * Defines an Entity items shape
 *
 * @param attributes Object of attributes
 * @return Item
 */
export const item: ItemTyper = <$MAP_ATTRIBUTE_ATTRIBUTES extends $MapAttributeAttributes = {}>(
  attributes: Narrow<$MAP_ATTRIBUTE_ATTRIBUTES>
): $Item<$MAP_ATTRIBUTE_ATTRIBUTES> =>
  ({
    [$type]: 'item',
    [$attributes]: attributes
  } as $Item<$MAP_ATTRIBUTE_ATTRIBUTES>)
