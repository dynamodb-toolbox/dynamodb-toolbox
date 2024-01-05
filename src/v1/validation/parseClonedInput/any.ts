import cloneDeep from 'lodash.clonedeep'

import type { AttributeBasicValue, Extension, AttributeValue } from 'v1/schema'

export function* parseAnyAttributeClonedInput<INPUT_EXTENSION extends Extension = never>(
  inputValue: AttributeBasicValue<INPUT_EXTENSION>
): Generator<AttributeValue<INPUT_EXTENSION>, AttributeValue<INPUT_EXTENSION>> {
  const clonedValue = cloneDeep(inputValue)
  yield clonedValue

  const parsedValue = clonedValue
  yield parsedValue

  const collapsedValue = parsedValue
  return collapsedValue
}
