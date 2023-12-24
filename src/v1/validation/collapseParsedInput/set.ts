import { SetAttributeBasicValue, Extension } from 'v1/schema'

import type { SetAttributeParsedBasicValue } from '../types'

export const collapseSetAttributeParsedInput = <EXTENSION extends Extension>(
  setInput: SetAttributeParsedBasicValue<EXTENSION>
): SetAttributeBasicValue<EXTENSION> => new Set(setInput)
