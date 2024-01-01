import type { Schema, Item, Extension } from 'v1/schema'
import type { If } from 'v1/types'

import type { HasExtension } from '../types'
import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseSchemaParsedInput = <EXTENSION extends Extension = never>(
  schema: Schema,
  parsedItem: Item<EXTENSION>,
  ...[collapseOptions = {} as CollapsingOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: CollapsingOptions<EXTENSION>],
    [options?: CollapsingOptions<EXTENSION>]
  >
): Item<EXTENSION> => {
  const collapsedItem: Item<EXTENSION> = {}

  Object.entries(parsedItem).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const attribute = schema.attributes[attributeName]

    const collapsedAttributeValue = collapseAttributeParsedInput(
      attribute,
      attributeInput,
      collapseOptions
    )

    collapsedItem[attribute.savedAs ?? attributeName] = collapsedAttributeValue
  })

  return collapsedItem
}
