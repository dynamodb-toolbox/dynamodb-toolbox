import type { Item, Extension } from 'v1/schema'
import type { ParsedItem } from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameSavedAsAttributes = <EXTENSION extends Extension>(
  schemaInput: ParsedItem<EXTENSION>
): Item<EXTENSION> => {
  const renamedInput: Item<EXTENSION> = {}

  Object.entries(schemaInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const renamedAttributeInput = renameAttributeSavedAsAttributes(attributeInput)
    renamedInput[schemaInput[$savedAs][attributeName] ?? attributeName] = renamedAttributeInput
  })

  return renamedInput
}
