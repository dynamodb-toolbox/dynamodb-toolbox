import { cloneDeep } from 'lodash'

import { DynamoDBToolboxError } from '~/errors/index.js'
import type {
  ExtendedValue,
  SetAttribute,
  SetAttributeElements
} from '~/schema/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { If } from '~/types/index.js'
import { isSet } from '~/utils/validation/isSet.js'

import { attrParser } from './attribute.js'
import type { AttrParsedValue, MustBeDefined } from './attribute.js'
import type { ParsedValue } from './parser.js'
import type {
  FromParsingOptions,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingOptions
} from './types/options.js'

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
