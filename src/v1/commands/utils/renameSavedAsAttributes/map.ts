import type { MapAttributeValue, Extension } from 'v1/schema'
import type { ParsedMapAttributeInput } from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameMapAttributeSavedAsAttributes = <EXTENSION extends Extension>(
  mapInput: ParsedMapAttributeInput<EXTENSION>
): MapAttributeValue<EXTENSION> => {
  const renamedInput: MapAttributeValue<EXTENSION> = {}

  Object.entries(mapInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const renamedAttributeInput = renameAttributeSavedAsAttributes(attributeInput)
    /**
     * @debt extensions "To fix by using ParsedMapAttributeBaseValue"
     */
    // @ts-expect-error
    renamedInput[mapInput[$savedAs][attributeName] ?? attributeName] = renamedAttributeInput
  })

  return renamedInput
}
