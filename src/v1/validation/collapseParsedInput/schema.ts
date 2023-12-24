import type { Item, Extension } from 'v1/schema'
import type { If } from 'v1/types'
import { $savedAs, $transform } from 'v1/schema/attributes/constants/attributeOptions'
import { isPrimitive } from 'v1/utils/validation/isPrimitive'

import type { ParsedItem, HasExtension } from '../types'
import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseSchemaParsedInput = <EXTENSION extends Extension = never>(
  parsedItem: ParsedItem<EXTENSION>,
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

    const collapsedAttributeValue = collapseAttributeParsedInput(attributeInput, collapseOptions)

    const attributeTransformer = parsedItem[$transform]?.[attributeName]
    collapsedItem[parsedItem[$savedAs]?.[attributeName] ?? attributeName] =
      attributeTransformer !== undefined && isPrimitive(collapsedAttributeValue)
        ? attributeTransformer.parse(collapsedAttributeValue)
        : collapsedAttributeValue
  })

  return collapsedItem
}
