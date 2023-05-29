import type { EntityV2, FormattedItem } from 'v1/entity'
import type { ResolvedItem, PossiblyUndefinedResolvedItem } from 'v1/schema'
import type { AnyAttributePath } from 'v1/commands/types/paths'

import { parseSavedAttribute } from './attribute'
import { matchProjection } from './utils'

type FormatSavedItemOptions<ENTITY extends EntityV2> = {
  attributes?: AnyAttributePath<ENTITY['schema']>[]
}

export const formatSavedItem = <
  ENTITY extends EntityV2,
  OPTIONS extends FormatSavedItemOptions<ENTITY>
>(
  entity: ENTITY,
  savedItem: ResolvedItem,
  formatSavedItemOptions: OPTIONS = {} as OPTIONS
): OPTIONS['attributes'] extends AnyAttributePath<ENTITY['schema']>[]
  ? FormattedItem<ENTITY, OPTIONS['attributes'][number]>
  : FormattedItem<ENTITY> => {
  const { attributes } = formatSavedItemOptions
  const formattedItem: PossiblyUndefinedResolvedItem = {}

  const schema = entity.schema

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

    const formattedAttribute = parseSavedAttribute(attribute, savedItem[attributeSavedAs], {
      projectedAttributes: childrenAttributes
    })

    if (formattedAttribute !== undefined) {
      formattedItem[attributeName] = formattedAttribute
    }
  })

  return formattedItem as any
}
