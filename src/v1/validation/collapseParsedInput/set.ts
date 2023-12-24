import type { SetAttributeBasicValue, Extension } from 'v1/schema'
import { $transform } from 'v1/schema/attributes/constants/attributeOptions'
import { isPrimitive } from 'v1/utils/validation/isPrimitive'

import type { SetAttributeParsedBasicValue } from '../types'

export const collapseSetAttributeParsedInput = <EXTENSION extends Extension>(
  setInput: SetAttributeParsedBasicValue<EXTENSION>
): SetAttributeBasicValue<EXTENSION> => {
  const elementsTransformer = setInput[$transform]

  if (elementsTransformer !== undefined) {
    return new Set(
      [...setInput.values()].map(element =>
        isPrimitive(element) ? elementsTransformer.parse(element) : element
      )
    )
  }

  return new Set(setInput)
}
