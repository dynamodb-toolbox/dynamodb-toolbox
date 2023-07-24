import type { ResolvedAttribute, Extension } from 'v1/schema'
import type { ParsedAttributeInput, ParsedMapAttributeInput } from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameRecordAttributeSavedAsAttributes } from './record'
import { renameMapAttributeSavedAsAttributes } from './map'
import { isArray } from 'v1/utils/validation/isArray'
import { isObject } from 'v1/utils/validation/isObject'

const isMapAttributeInput = <EXTENSION extends Extension>(
  attributeInput: ParsedAttributeInput<EXTENSION> & Record<string, unknown>
): attributeInput is ParsedMapAttributeInput<EXTENSION> => $savedAs in attributeInput

export const renameAttributeSavedAsAttributes = <EXTENSION extends Extension>(
  attributeInput: ParsedAttributeInput<EXTENSION>
): ResolvedAttribute<EXTENSION> => {
  if (isArray(attributeInput)) {
    return attributeInput.map(renameAttributeSavedAsAttributes)
  }

  if (isObject(attributeInput)) {
    return isMapAttributeInput(attributeInput)
      ? renameMapAttributeSavedAsAttributes(attributeInput)
      : renameRecordAttributeSavedAsAttributes(attributeInput)
  }

  return attributeInput
}
