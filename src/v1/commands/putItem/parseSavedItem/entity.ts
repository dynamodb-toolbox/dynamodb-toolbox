import cloneDeep from 'lodash.clonedeep'

import { EntityV2, FormattedItem } from 'v1/entity'
import { ResolvedItem } from 'v1/item'

import { parseSavedAttribute } from './attribute'

export const parseSavedItem = <ENTITY extends EntityV2>(
  entity: ENTITY,
  savedItem: ResolvedItem
): FormattedItem<ENTITY> => {
  const formattedItem: ResolvedItem = {}

  const additionalAttributes = new Set(Object.keys(savedItem))
  const item = entity.item

  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    const attributeSavedAs = attribute.savedAs ?? attributeName

    additionalAttributes.delete(attributeSavedAs)

    if (attribute.hidden) {
      return
    }

    if (savedItem[attributeSavedAs] !== undefined) {
      formattedItem[attributeName] = parseSavedAttribute(attribute, savedItem[attributeSavedAs])
    }
  })

  additionalAttributes.forEach(attributeName => {
    formattedItem[attributeName] = cloneDeep(savedItem[attributeName])
  })

  return formattedItem as FormattedItem<ENTITY>
}
