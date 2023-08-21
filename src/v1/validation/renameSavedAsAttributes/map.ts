import type { MapAttributeBasicValue, Extension } from 'v1/schema'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import type { MapAttributeParsedBasicValue } from '../types'
import type { RenamingOptions } from './types'
import { renameAttributeSavedAsAttributes } from './attribute'

export const renameMapAttributeSavedAsAttributes = <EXTENSION extends Extension>(
  mapInput: MapAttributeParsedBasicValue<EXTENSION>,
  renamingOptions = {} as RenamingOptions<EXTENSION>
): MapAttributeBasicValue<EXTENSION> => {
  const renamedInput: MapAttributeBasicValue<EXTENSION> = {}

  Object.entries(mapInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const renamedAttributeInput = renameAttributeSavedAsAttributes(attributeInput, renamingOptions)
    renamedInput[mapInput[$savedAs][attributeName] ?? attributeName] = renamedAttributeInput
  })

  return renamedInput
}
