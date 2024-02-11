import type { EntityV2, FormattedItem } from 'v1/entity'
import type { Item } from 'v1/schema'
import type { AnyAttributePath } from 'v1/operations/types'

import { formatSavedAttribute } from './attribute'
import { matchProjection } from './utils'

type FormatSavedItemOptions<ENTITY extends EntityV2> = {
  attributes?: AnyAttributePath<ENTITY>[]
  partial?: boolean
}

export const formatSavedItem = <
  ENTITY extends EntityV2,
  OPTIONS extends FormatSavedItemOptions<ENTITY>
>(
  entity: ENTITY,
  savedItem: Item,
  { attributes, partial = false }: OPTIONS = {} as OPTIONS
): OPTIONS['attributes'] extends AnyAttributePath<ENTITY>[]
  ? FormattedItem<ENTITY, { attributes: OPTIONS['attributes'][number] }>
  : FormattedItem<ENTITY> => {
  const formattedItem: Item = {}

  const schema = entity.schema

  const partitionKey = savedItem[entity.table.partitionKey.name]
  const sortKey = entity.table.sortKey && savedItem[entity.table.sortKey.name]

  Object.entries(schema.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp('^' + attributeName),
      attributes
    )

    if (!isProjected) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = formatSavedAttribute(attribute, savedItem[attributeSavedAs], {
      projectedAttributes: childrenAttributes,
      partial,
      ...(partitionKey !== undefined ? { partitionKey } : {}),
      ...(sortKey !== undefined ? { sortKey } : {})
    })

    if (formattedAttribute !== undefined) {
      formattedItem[attributeName] = formattedAttribute
    }
  })

  return formattedItem as any
}
