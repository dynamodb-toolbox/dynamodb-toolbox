import type { ListAttribute, ListAttributeBasicValue, Extension } from 'v1/schema'

import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseListAttributeParsedInput = <EXTENSION extends Extension>(
  listAttribute: ListAttribute,
  listInput: ListAttributeBasicValue<EXTENSION>,
  collapsingOptions = {} as CollapsingOptions<EXTENSION>
): ListAttributeBasicValue<EXTENSION> =>
  listInput.map(elementInput =>
    collapseAttributeParsedInput(listAttribute.elements, elementInput, collapsingOptions)
  )
