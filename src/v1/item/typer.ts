import type { _MapAttributeAttributes, _Attribute, Narrow } from './attributes'
import { $type, $attributes, $open } from './attributes/constants/attributeOptions'
import type { _Item } from './interface'

type ItemTyper = <
  _MAP_ATTRIBUTE_ATTRIBUTES extends _MapAttributeAttributes = Record<never, _Attribute>
>(
  attributes: Narrow<_MAP_ATTRIBUTE_ATTRIBUTES>
) => _Item<_MAP_ATTRIBUTE_ATTRIBUTES>

// TODO: Enable item opening
/**
 * Defines an Entity items shape
 *
 * @param attributes Object of attributes
 * @return Item
 */
export const item: ItemTyper = <
  _MAP_ATTRIBUTE_ATTRIBUTES extends _MapAttributeAttributes = Record<never, _Attribute>
>(
  attributes: Narrow<_MAP_ATTRIBUTE_ATTRIBUTES>
): _Item<_MAP_ATTRIBUTE_ATTRIBUTES> =>
  ({
    [$type]: 'item',
    [$open]: false,
    [$attributes]: attributes
  } as _Item<_MAP_ATTRIBUTE_ATTRIBUTES>)
