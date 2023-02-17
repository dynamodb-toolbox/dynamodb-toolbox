import { EntityV2, FormattedItem } from 'v1/entity'
import { ResolvedItem } from 'v1/item'

import { parseSavedAttribute } from './attribute'

export const parseSavedItem = <ENTITY extends EntityV2>(
  entity: ENTITY,
  savedItem: ResolvedItem
): FormattedItem<ENTITY> => {
  const formattedItem: ResolvedItem = {}

  const item = entity.item

  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    const attributeSavedAs = attribute.savedAs ?? attributeName

    if (attribute.hidden) {
      return
    }

    if (savedItem[attributeSavedAs] !== undefined) {
      const formattedAttribute = parseSavedAttribute(attribute, savedItem[attributeSavedAs])

      if (formattedAttribute !== undefined) {
        formattedItem[attributeName] = parseSavedAttribute(attribute, savedItem[attributeSavedAs])
      }
    }
  })

  return formattedItem as FormattedItem<ENTITY>
}
