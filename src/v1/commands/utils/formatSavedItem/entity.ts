import { EntityV2, FormattedItem } from 'v1/entity'
import { ResolvedItem, PossiblyUndefinedResolvedItem } from 'v1/item'

import { parseSavedAttribute } from './attribute'

export const formatSavedItem = <ENTITY extends EntityV2>(
  entity: ENTITY,
  savedItem: ResolvedItem
): FormattedItem<ENTITY> => {
  const formattedItem: PossiblyUndefinedResolvedItem = {}

  const item = entity.item

  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = parseSavedAttribute(attribute, savedItem[attributeSavedAs])
    if (formattedAttribute !== undefined) {
      formattedItem[attributeName] = formattedAttribute
    }
  })

  return formattedItem as FormattedItem<ENTITY>
}
