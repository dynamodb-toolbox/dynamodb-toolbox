import { MappedProperties } from './property'
import { Narrow, validateProperty } from './utility'

export interface Item<P extends MappedProperties = MappedProperties> {
  _type: 'item'
  _properties: P
}

type ItemTyper = <P extends MappedProperties = {}>(_properties: Narrow<P>) => Item<P>

export const item: ItemTyper = <P extends MappedProperties = {}>(
  _properties: Narrow<P>
): Item<P> => {
  Object.entries(_properties).forEach(([propertyName, property]) => {
    validateProperty(property, propertyName)
  })

  return {
    _type: 'item',
    _properties
  } as Item<P>
}
