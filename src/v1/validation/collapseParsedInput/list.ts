import type { ListAttributeBasicValue, Extension } from 'v1/schema'
import { $transform } from 'v1/schema/attributes/constants/attributeOptions'
import { isPrimitive } from 'v1/utils/validation/isPrimitive'

import type { ListAttributeParsedBasicValue } from '../types'
import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseListAttributeParsedInput = <EXTENSION extends Extension>(
  listInput: ListAttributeParsedBasicValue<EXTENSION>,
  collapsingOptions = {} as CollapsingOptions<EXTENSION>
): ListAttributeBasicValue<EXTENSION> => {
  const collapsedElements = listInput.map(elementInput =>
    collapseAttributeParsedInput(elementInput, collapsingOptions)
  )

  const elementsTransformer = listInput[$transform]
  if (elementsTransformer === undefined) {
    return collapsedElements
  }

  return collapsedElements.map(value =>
    isPrimitive(value) ? elementsTransformer.parse(value) : value
  )
}
