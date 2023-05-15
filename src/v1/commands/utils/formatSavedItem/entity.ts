import { EntityV2, FormattedItem } from 'v1/entity'
import { ResolvedItem, PossiblyUndefinedResolvedItem } from 'v1/item'
import { AnyAttributePath } from 'v1/commands/types/paths'

import { parseSavedAttribute } from './attribute'
import { matchProjection } from './utils'

type FormatSavedItemOptions<ENTITY extends EntityV2> = {
  projectedAttributes?: AnyAttributePath<ENTITY['item']>[]
}

export const formatSavedItem = <
  ENTITY extends EntityV2,
  OPTIONS extends FormatSavedItemOptions<ENTITY>
>(
  entity: ENTITY,
  savedItem: ResolvedItem,
  formatSavedItemOptions: OPTIONS = {} as OPTIONS
): FormattedItem<ENTITY> => {
  const { projectedAttributes } = formatSavedItemOptions
  const formattedItem: PossiblyUndefinedResolvedItem = {}

  const item = entity.item

  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp('^' + attributeName),
      projectedAttributes
    )

    if (!isProjected) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = parseSavedAttribute(attribute, savedItem[attributeSavedAs], {
      projectedAttributes: childrenAttributes
    })

    if (formattedAttribute !== undefined) {
      formattedItem[attributeName] = formattedAttribute
    }
  })

  return formattedItem as FormattedItem<ENTITY>
}
