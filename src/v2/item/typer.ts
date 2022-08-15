import type { MappedProperties, Narrow } from './typers/types'
import { validateProperty } from './typers/validate'

import type { Item } from './interface'

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
