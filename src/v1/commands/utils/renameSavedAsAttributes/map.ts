import type { MapAttributeBasicValue, Extension } from 'v1/schema'
import type { MapAttributeParsedBasicValue } from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameMapAttributeSavedAsAttributes = <EXTENSION extends Extension>(
  mapInput: MapAttributeParsedBasicValue<EXTENSION>
): MapAttributeBasicValue<EXTENSION> => {
  const renamedInput: MapAttributeBasicValue<EXTENSION> = {}

  Object.entries(mapInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const renamedAttributeInput = renameAttributeSavedAsAttributes(attributeInput)
    renamedInput[mapInput[$savedAs][attributeName] ?? attributeName] = renamedAttributeInput
  })

  return renamedInput
}
