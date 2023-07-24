import type { AttributeValue, Extension } from 'v1/schema'
import type {
  AttributeParsedValue,
  MapAttributeParsedBasicValue,
  RecordAttributeParsedBasicValue
} from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameRecordAttributeSavedAsAttributes } from './record'
import { renameMapAttributeSavedAsAttributes } from './map'
import { isArray } from 'v1/utils/validation/isArray'
import { isObject } from 'v1/utils/validation/isObject'

const isMapAttributeInput = <EXTENSION extends Extension>(
  attributeInput:
    | MapAttributeParsedBasicValue<EXTENSION>
    | RecordAttributeParsedBasicValue<EXTENSION>
): attributeInput is MapAttributeParsedBasicValue<EXTENSION> => $savedAs in attributeInput

export const renameAttributeSavedAsAttributes = <EXTENSION extends Extension>(
  attributeInput: AttributeParsedValue<EXTENSION>
): AttributeValue<EXTENSION> => {
  if (isArray(attributeInput)) {
    return attributeInput.map(renameAttributeSavedAsAttributes)
  }

  // Note: There is some magic/luck here as technically AttributeParsedValue could be a map object extension
  if (isObject(attributeInput)) {
    return isMapAttributeInput(attributeInput)
      ? renameMapAttributeSavedAsAttributes(attributeInput)
      : renameRecordAttributeSavedAsAttributes(attributeInput)
  }

  return attributeInput
}
