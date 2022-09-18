import { MappedProperties } from './typers'

/**
 * Entity items shape
 *
 * @param P Object of properties
 * @return Item
 */
export interface Item<P extends MappedProperties = MappedProperties> {
  _type: 'item'
  _open: boolean
  _properties: P
}
