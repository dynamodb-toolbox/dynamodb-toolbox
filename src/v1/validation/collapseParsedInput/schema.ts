import type { Item, Extension } from 'v1/schema'
import type { If } from 'v1/types'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

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
  const collapsedInput: Item<EXTENSION> = {}

  Object.entries(parsedItem).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const collapsedAttributeInput = collapseAttributeParsedInput(attributeInput, collapseOptions)
    collapsedInput[parsedItem[$savedAs]?.[attributeName] ?? attributeName] = collapsedAttributeInput
  })

  return collapsedInput
}
