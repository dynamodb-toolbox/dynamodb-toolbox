import type { ListAttributeBasicValue, Extension } from 'v1/schema'

import type { ListAttributeParsedBasicValue } from '../types'
import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseListAttributeParsedInput = <EXTENSION extends Extension>(
  lsitInput: ListAttributeParsedBasicValue<EXTENSION>,
  collapsingOptions = {} as CollapsingOptions<EXTENSION>
): ListAttributeBasicValue<EXTENSION> =>
  lsitInput.map(elementInput => collapseAttributeParsedInput(elementInput, collapsingOptions))
