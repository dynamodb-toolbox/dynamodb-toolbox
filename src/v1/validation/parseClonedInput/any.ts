import cloneDeep from 'lodash.clonedeep'

import type { AttributeBasicValue, Extension, Item } from 'v1/schema'
import type { If } from 'v1/types'

import type { HasExtension } from '../types'
import type { ParsingOptions } from './types'

export function* parseAnyAttributeClonedInput<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  inputValue: AttributeBasicValue<INPUT_EXTENSION>,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  AttributeBasicValue<INPUT_EXTENSION>,
  AttributeBasicValue<INPUT_EXTENSION>,
  Item<SCHEMA_EXTENSION> | undefined
> {
  const { clone = true } = options

  const startValue: AttributeBasicValue<INPUT_EXTENSION> = cloneDeep(inputValue)
  let linkedValue: AttributeBasicValue<INPUT_EXTENSION> | undefined = undefined

  if (clone) {
    const clonedValue = startValue
    yield clonedValue

    linkedValue = clonedValue
    yield linkedValue
  }

  const parsedValue = linkedValue ?? startValue
  yield parsedValue

  const collapsedValue = parsedValue
  return collapsedValue
}
