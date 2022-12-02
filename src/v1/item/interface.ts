import { _MapAttributeAttributes, MapAttributeAttributes, RequiredOption } from './attributes'
import { FreezeAttribute } from './attributes/freeze'

/**
 * Entity items shape
 *
 * @param MapAttributeAttributesInput Object of attributes
 * @return Item
 */
export interface _Item<
  _MAP_ATTRIBUTE_ATTRIBUTES extends _MapAttributeAttributes = _MapAttributeAttributes
> {
  _type: 'item'
  _open: boolean
  _attributes: _MAP_ATTRIBUTE_ATTRIBUTES
}

export interface Item<
  MAP_ATTRIBUTE_ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes
> {
  type: 'item'
  open: boolean
  requiredAttributesNames: Record<RequiredOption, Set<string>>
  attributes: MAP_ATTRIBUTE_ATTRIBUTES
}

export type FreezeItem<_ITEM extends _Item> = _Item extends _ITEM
  ? Item
  : Item<
      {
        [key in keyof _ITEM['_attributes']]: FreezeAttribute<_ITEM['_attributes'][key]>
      }
    >
