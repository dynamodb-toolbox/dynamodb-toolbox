import { MappedAttributes } from './typers'

/**
 * Entity items shape
 *
 * @param MappedAttributesInput Object of attributes
 * @return Item
 */
export interface Item<MappedAttributesInput extends MappedAttributes = MappedAttributes> {
  _type: 'item'
  _open: boolean
  _attributes: MappedAttributesInput
}
