import type { MappedProperties, Narrow } from './typers/types'
import { validateProperty } from './typers/validate'

import type { Item } from './interface'

type ItemTyper = <P extends MappedProperties = {}>(_properties: Narrow<P>) => Item<P>

// TODO: Enable item opening
/**
 * Defines an Entity items shape
 *
 * @param properties Object of properties
 * @return Item
 */
export const item: ItemTyper = <P extends MappedProperties = {}>(
  properties: Narrow<P>
): Item<P> => {
  // Validation is run at item definition only
  // This avoids unnecessary compute and bugs (validating incomplete items)
  Object.entries(properties).forEach(([propertyName, property]) => {
    validateProperty(property, propertyName)
  })

  return {
    _type: 'item',
    _open: false,
    _properties: properties
  } as Item<P>
}
