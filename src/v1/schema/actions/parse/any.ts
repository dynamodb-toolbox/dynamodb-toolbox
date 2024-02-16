import cloneDeep from 'lodash.clonedeep'

import type { Schema, AnyAttribute, Extension, ExtendedValue } from 'v1/schema'
import type { If } from 'v1/types'

import type { ValidValue } from './parser'
import type { HasExtension, ParsingOptions } from './types'

export type ValidAnyAttrValue<
  ATTRIBUTE extends AnyAttribute,
  EXTENSION extends Extension = never
> = ATTRIBUTE['castAs'] | ExtendedValue<EXTENSION, 'any'>

export function* anyAttrWorkflow<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  inputValue: unknown,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  ValidAnyAttrValue<AnyAttribute, INPUT_EXTENSION>,
  ValidAnyAttrValue<AnyAttribute, INPUT_EXTENSION>,
  ValidValue<Schema, SCHEMA_EXTENSION> | undefined
> {
  const { fill = true, transform = true } = options

  let linkedValue = undefined
  if (fill) {
    const defaultedValue = cloneDeep(inputValue)
    yield defaultedValue

    linkedValue = defaultedValue
    yield linkedValue
  }

  const parsedValue = linkedValue ?? cloneDeep(inputValue)

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = parsedValue
  return transformedValue
}
