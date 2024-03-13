import cloneDeep from 'lodash.clonedeep'

import type { Schema, SetAttribute, SetAttributeElements, ExtendedValue } from 'v1/schema'
import type { If } from 'v1/types'
import { isSet } from 'v1/utils/validation/isSet'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsedValue } from './parser'
import type {
  ParsedValueOptions,
  ParsedValueDefaultOptions,
  ParsingOptions,
  FromParsingOptions
} from './types'
import { attrParser, AttrParsedValue, MustBeDefined } from './attribute'

export type SetAttrParsedValue<
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = SetAttribute extends ATTRIBUTE
  ? Set<AttrParsedValue<SetAttribute['elements']>>
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | Set<AttrParsedValue<ATTRIBUTE['elements'], OPTIONS>>
      | ExtendedValue<NonNullable<OPTIONS['extension']>, 'set'>

export function* setAttrParser<ATTRIBUTE extends SetAttribute, OPTIONS extends ParsingOptions>(
  attribute: ATTRIBUTE,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  SetAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  SetAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
> {
  type Parsed = SetAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>

  const { fill = true, transform = true } = options

  const parsers: Generator<
    ParsedValue<SetAttributeElements, FromParsingOptions<OPTIONS>>,
    ParsedValue<SetAttributeElements, FromParsingOptions<OPTIONS>>,
    ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
  >[] = []

  const isInputValueSet = isSet(inputValue)
  if (isInputValueSet) {
    for (const element of inputValue.values()) {
      parsers.push(attrParser(attribute.elements, element, options))
    }
  }

  if (fill) {
    if (isInputValueSet) {
      const defaultedValue = new Set(parsers.map(parser => parser.next().value))
      yield defaultedValue as Parsed

      const linkedValue = new Set(parsers.map(parser => parser.next().value))
      yield linkedValue as Parsed
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue as Parsed

      const linkedValue = defaultedValue
      yield linkedValue as Parsed
    }
  }

  if (!isInputValueSet) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${path !== undefined ? `'${path}' ` : ''}should be a ${type}.`,
      path,
      payload: {
        received: inputValue,
        expected: type
      }
    })
  }

  const parsedValue = new Set(parsers.map(parser => parser.next().value))

  if (transform) {
    yield parsedValue as Parsed
  } else {
    return parsedValue as Parsed
  }

  const transformedValue = new Set(parsers.map(parser => parser.next().value))
  return transformedValue as Parsed
}
