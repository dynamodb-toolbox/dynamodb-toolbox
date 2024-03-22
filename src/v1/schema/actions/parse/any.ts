import cloneDeep from 'lodash.clonedeep'

import type { Schema } from 'v1/schema'
import type { AnyAttribute, ExtendedValue } from 'v1/schema/attributes'

import type { ParsedValue } from './parser'
import type {
  ParsedValueOptions,
  ParsedValueDefaultOptions,
  ParsingOptions,
  FromParsingOptions
} from './types'

export type AnyAttrParsedValue<
  ATTRIBUTE extends AnyAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = AnyAttribute extends ATTRIBUTE
  ? unknown
  : ATTRIBUTE['castAs'] | ExtendedValue<NonNullable<OPTIONS['extension']>, 'any'>

export function* anyAttrParser<
  ATTRIBUTE extends AnyAttribute,
  OPTIONS extends ParsingOptions = ParsingOptions
>(
  _: ATTRIBUTE,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  AnyAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  AnyAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
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
