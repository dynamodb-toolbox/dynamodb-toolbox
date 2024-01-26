import cloneDeep from 'lodash.clonedeep'

import type { AttributeBasicValue, Extension, Item } from 'v1/schema'
import type { If } from 'v1/types'

import type { HasExtension, ParsingOptions } from './types'

export function* anyAttributeParser<
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
  const { fill = true } = options

  let linkedValue: AttributeBasicValue<INPUT_EXTENSION> | undefined = undefined
  if (fill) {
    const defaultedValue = cloneDeep(inputValue)
    yield defaultedValue

    linkedValue = defaultedValue
    yield linkedValue
  }

  const parsedValue = linkedValue ?? cloneDeep(inputValue)
  yield parsedValue

  const transformedValue = parsedValue
  return transformedValue
}
