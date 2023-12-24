import type { Extension } from 'v1/schema'
import { $keys, $elements, $transform } from 'v1/schema/attributes/constants/attributeOptions'
import { isPrimitive } from 'v1/utils/validation/isPrimitive'

import type { RecordAttributeParsedBasicValue } from '../types'
import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseRecordAttributeParsedInput = <EXTENSION extends Extension>(
  recordInput: RecordAttributeParsedBasicValue<EXTENSION>,
  collapsingOptions = {} as CollapsingOptions<EXTENSION>
): RecordAttributeParsedBasicValue<EXTENSION> => {
  const collapsedInput: RecordAttributeParsedBasicValue<EXTENSION> = {}

  Object.entries(recordInput).forEach(([elementKey, elementValue]) => {
    if (elementValue === undefined) {
      return
    }

    const collapsedElementValue = collapseAttributeParsedInput(elementValue, collapsingOptions)

    const keysTransformer = recordInput[$transform]?.[$keys]
    const elementsTransformer = recordInput[$transform]?.[$elements]

    collapsedInput[keysTransformer !== undefined ? keysTransformer.parse(elementKey) : elementKey] =
      elementsTransformer !== undefined && isPrimitive(collapsedElementValue)
        ? elementsTransformer.parse(collapsedElementValue)
        : collapsedElementValue
  })

  return collapsedInput
}
