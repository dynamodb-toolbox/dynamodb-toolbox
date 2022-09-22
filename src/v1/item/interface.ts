import { MappedProperties } from './typers'

/**
 * Entity items shape
 *
 * @param MappedPropertiesInput Object of properties
 * @return Item
 */
export interface Item<MappedPropertiesInput extends MappedProperties = MappedProperties> {
  _type: 'item'
  _open: boolean
  _properties: MappedPropertiesInput
}
