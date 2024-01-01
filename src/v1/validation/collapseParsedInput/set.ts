import type { SetAttribute, SetAttributeBasicValue, Extension } from 'v1/schema'

import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseSetAttributeParsedInput = <EXTENSION extends Extension>(
  setAttribute: SetAttribute,
  setInput: SetAttributeBasicValue<EXTENSION>,
  collapsingOptions = {} as CollapsingOptions<EXTENSION>
): SetAttributeBasicValue<EXTENSION> =>
  new Set(
    [...setInput.values()].map(element =>
      collapseAttributeParsedInput(setAttribute.elements, element, collapsingOptions)
    )
  )
