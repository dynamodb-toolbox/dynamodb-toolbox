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
import { collapseRecordAttributeParsedInput } from './record'
import { collapseMapAttributeParsedInput } from './map'
import { defaultCollapseExtension } from './utils'

import type { ExtensionCollapser, CollapsingOptions } from './types'

/**
 * @debt bug "This is not ideal. TODO: add $type symbol to parsed attributes."
 */
const isMapAttributeParsedInput = <EXTENSION extends Extension>(
  attributeInput:
    | MapAttributeParsedBasicValue<EXTENSION>
    | RecordAttributeParsedBasicValue<EXTENSION>
): attributeInput is MapAttributeParsedBasicValue<EXTENSION> => $savedAs in attributeInput

export const collapseAttributeParsedInput = <EXTENSION extends Extension = never>(
  parsedInput: AttributeParsedValue<EXTENSION>,
  ...[renamingOptions = {} as CollapsingOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: CollapsingOptions<EXTENSION>],
    [options?: CollapsingOptions<EXTENSION>]
  >
): AttributeValue<EXTENSION> => {
  const {
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    collapseExtension = (defaultCollapseExtension as unknown) as ExtensionCollapser<EXTENSION>
  } = renamingOptions

  const { isExtension, collapsedExtension, basicInput } = collapseExtension(
    parsedInput,
    renamingOptions
  )

  if (isExtension) {
    return collapsedExtension
  }

  if (isArray(basicInput)) {
    return basicInput.map(elementInput =>
      collapseAttributeParsedInput(elementInput, renamingOptions)
    )
  }

  if (isObject(basicInput)) {
    return isMapAttributeParsedInput(basicInput)
      ? collapseMapAttributeParsedInput(basicInput, renamingOptions)
      : collapseRecordAttributeParsedInput(basicInput, renamingOptions)
  }

  return basicInput
}
