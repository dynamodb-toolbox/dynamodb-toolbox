import type { ResolvedItem, Extension } from 'v1/schema'
import type { ParsedSchemaInput } from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameSavedAsAttributes = <EXTENSION extends Extension>(
  schemaInput: ParsedSchemaInput<EXTENSION>
): ResolvedItem<EXTENSION> => {
  const renamedInput: ResolvedItem<EXTENSION> = {}

  Object.entries(schemaInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const renamedAttributeInput = renameAttributeSavedAsAttributes(attributeInput)
    renamedInput[schemaInput[$savedAs][attributeName] ?? attributeName] = renamedAttributeInput
  })

  return renamedInput
}
