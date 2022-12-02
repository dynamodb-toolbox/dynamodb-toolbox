import { _MapAttributeAttributes, MapAttributeAttributes, RequiredOption } from './attributes'
import { FreezeAttribute } from './attributes/freeze'

/**
 * Entity items shape
 *
 * @param MapAttributeAttributesInput Object of attributes
 * @return Item
 */
export interface _Item<
  MapAttributeAttributesInput extends _MapAttributeAttributes = _MapAttributeAttributes
> {
  _type: 'item'
  _open: boolean
  _attributes: MapAttributeAttributesInput
}

export interface Item<
  MapAttributeAttributesInput extends MapAttributeAttributes = MapAttributeAttributes
> {
  type: 'item'
  open: boolean
  requiredAttributesNames: Record<RequiredOption, Set<string>>
  attributes: MapAttributeAttributesInput
}

export type FreezeItem<ItemInput extends _Item> = _Item extends ItemInput
  ? Item
  : Item<
      {
        [key in keyof ItemInput['_attributes']]: FreezeAttribute<ItemInput['_attributes'][key]>
      }
    >
