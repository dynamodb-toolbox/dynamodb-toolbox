import type { ResolvedAttribute, AdditionalResolution } from 'v1/schema'
import type { ParsedAttributeInput, ParsedMapAttributeInput } from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameRecordAttributeSavedAsAttributes } from './record'
import { renameMapAttributeSavedAsAttributes } from './map'
import { isArray } from 'v1/utils/validation/isArray'
import { isObject } from 'v1/utils/validation/isObject'

const isMapAttributeInput = <ADDITIONAL_RESOLUTION extends AdditionalResolution>(
  attributeInput: ParsedAttributeInput<ADDITIONAL_RESOLUTION> & Record<string, unknown>
): attributeInput is ParsedMapAttributeInput<ADDITIONAL_RESOLUTION> => $savedAs in attributeInput

export const renameAttributeSavedAsAttributes = <
  ADDITIONAL_RESOLUTION extends AdditionalResolution
>(
  attributeInput: ParsedAttributeInput<ADDITIONAL_RESOLUTION>
): ResolvedAttribute<ADDITIONAL_RESOLUTION> => {
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
