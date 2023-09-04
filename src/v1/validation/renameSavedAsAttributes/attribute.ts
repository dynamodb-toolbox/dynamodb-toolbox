import type { AttributeValue, Extension } from 'v1/schema'

import type { If } from 'v1/types'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'
import { isArray } from 'v1/utils/validation/isArray'
import { isObject } from 'v1/utils/validation/isObject'

import type {
  HasExtension,
  AttributeParsedValue,
  MapAttributeParsedBasicValue,
  RecordAttributeParsedBasicValue
} from '../types'
import { renameRecordAttributeSavedAsAttributes } from './record'
import { renameMapAttributeSavedAsAttributes } from './map'
import { defaultRenameExtension } from './utils'

import type { ExtensionRenamer, RenamingOptions } from './types'

const isMapAttributeInput = <EXTENSION extends Extension>(
  attributeInput:
    | MapAttributeParsedBasicValue<EXTENSION>
    | RecordAttributeParsedBasicValue<EXTENSION>
): attributeInput is MapAttributeParsedBasicValue<EXTENSION> => $savedAs in attributeInput

export const renameAttributeSavedAsAttributes = <EXTENSION extends Extension = never>(
  parsedInput: AttributeParsedValue<EXTENSION>,
  ...[renamingOptions = {} as RenamingOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: RenamingOptions<EXTENSION>],
    [options?: RenamingOptions<EXTENSION>]
  >
): AttributeValue<EXTENSION> => {
  const {
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    renameExtension = (defaultRenameExtension as unknown) as ExtensionRenamer<EXTENSION>
  } = renamingOptions

  const { isExtension, renamedExtension, basicInput } = renameExtension(
    parsedInput,
    renamingOptions
  )

  if (isExtension) {
    return renamedExtension
  }

  if (isArray(basicInput)) {
    return basicInput.map(elementInput =>
      renameAttributeSavedAsAttributes(elementInput, renamingOptions)
    )
  }

  if (isObject(basicInput)) {
    return isMapAttributeInput(basicInput)
      ? renameMapAttributeSavedAsAttributes(basicInput, renamingOptions)
      : renameRecordAttributeSavedAsAttributes(basicInput, renamingOptions)
  }

  return basicInput
}
