import { _MapAttributeAttributes, MapAttributeAttributes, RequiredOption } from './attributes'
import { FreezeAttribute } from './attributes/freeze'
import { $type, $attributes, $open } from './attributes/constants/symbols'

/**
 * Entity items shape
 *
 * @param MapAttributeAttributesInput Object of attributes
 * @return Item
 */
export interface _Item<
  _MAP_ATTRIBUTE_ATTRIBUTES extends _MapAttributeAttributes = _MapAttributeAttributes
> {
  [$type]: 'item'
  [$open]: boolean
  [$attributes]: _MAP_ATTRIBUTE_ATTRIBUTES
}

export interface Item<
  MAP_ATTRIBUTE_ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes
> {
  type: 'item'
  open: boolean
  keyAttributesNames: Set<string>
  requiredAttributesNames: Record<RequiredOption, Set<string>>
  attributes: MAP_ATTRIBUTE_ATTRIBUTES
}

export type FreezeItem<_ITEM extends _Item> = _Item extends _ITEM
  ? Item
  : Item<
      {
        [KEY in keyof _ITEM[$attributes]]: FreezeAttribute<_ITEM[$attributes][KEY]>
      }
    >
