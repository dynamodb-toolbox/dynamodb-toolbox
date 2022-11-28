import { MapAttributeAttributes, FrozenMapAttributeAttributes, RequiredOption } from './attributes'
import { FreezeAttribute } from './attributes/freeze'

/**
 * Entity items shape
 *
 * @param MapAttributeAttributesInput Object of attributes
 * @return Item
 */
export interface _Item<
  MapAttributeAttributesInput extends MapAttributeAttributes = MapAttributeAttributes
> {
  _type: 'item'
  _open: boolean
  _attributes: MapAttributeAttributesInput
}

export interface FrozenItem<
  MapAttributeAttributesInput extends FrozenMapAttributeAttributes = FrozenMapAttributeAttributes
> {
  type: 'item'
  open: boolean
  requiredAttributesNames: Record<RequiredOption, Set<string>>
  attributes: MapAttributeAttributesInput
}

export type FreezeItem<ItemInput extends _Item> = _Item extends ItemInput
  ? FrozenItem
  : FrozenItem<
      {
        [key in keyof ItemInput['_attributes']]: FreezeAttribute<ItemInput['_attributes'][key]>
      }
    >
