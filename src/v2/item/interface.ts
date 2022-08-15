import { MappedProperties } from './typers'

export interface Item<P extends MappedProperties = MappedProperties> {
  _type: 'item'
  _properties: P
}
