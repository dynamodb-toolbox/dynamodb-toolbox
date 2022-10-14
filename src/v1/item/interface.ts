import { MapAttributeAttributes } from './attributes'

/**
 * Entity items shape
 *
 * @param MapAttributeAttributesInput Object of attributes
 * @return Item
 */
export interface Item<
  MapAttributeAttributesInput extends MapAttributeAttributes = MapAttributeAttributes
> {
  _type: 'item'
  _open: boolean
  _attributes: MapAttributeAttributesInput
}
