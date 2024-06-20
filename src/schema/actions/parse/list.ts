import { cloneDeep } from 'lodash'

import type { Schema } from '~/schema/index.js'
import type { Attribute, ListAttribute, ExtendedValue } from '~/schema/attributes/index.js'
import type { If } from '~/types/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import type { ParsedValue } from './parser.js'
import type {
  ParsedValueOptions,
  ParsedValueDefaultOptions,
  ParsingOptions,
  FromParsingOptions
} from './types/options.js'
import { attrParser, AttrParsedValue, MustBeDefined } from './attribute.js'

export type ListAttrParsedValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = ListAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrParsedValue<ATTRIBUTE['elements']>[]
      | ExtendedValue<NonNullable<OPTIONS['extension']>, 'list'>

export function* listAttrParser<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends ParsingOptions = ParsingOptions
>(
  attribute: ATTRIBUTE,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  ListAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  ListAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
> {
  type Parsed = ListAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>

  const { fill = true, transform = true } = options

  const parsers: Generator<
    ParsedValue<Attribute, FromParsingOptions<OPTIONS>>,
    ParsedValue<Attribute, FromParsingOptions<OPTIONS>>,
    ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
  >[] = []

  const isInputValueArray = isArray(inputValue)
  if (isInputValueArray) {
    for (const element of inputValue) {
      parsers.push(attrParser(attribute.elements, element, options))
    }
  }

  if (fill) {
    if (isInputValueArray) {
      const defaultedValue = parsers.map(parser => parser.next().value)
      const itemInput = yield defaultedValue as Parsed

      const linkedValue = parsers.map(parser => parser.next(itemInput).value)
      yield linkedValue as Parsed
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue as Parsed

      const linkedValue = defaultedValue
      yield linkedValue as Parsed
    }
  }

  if (!isInputValueArray) {
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

  const parsedValue = parsers.map(parser => parser.next().value)

  if (transform) {
    yield parsedValue as Parsed
  } else {
    return parsedValue as Parsed
  }

  const transformedValue = parsers.map(parser => parser.next().value)
  return transformedValue as Parsed
}
