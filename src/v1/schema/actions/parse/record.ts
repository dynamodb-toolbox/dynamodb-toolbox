import cloneDeep from 'lodash.clonedeep'

import type { Schema } from 'v1/schema'
import type {
  Attribute,
  RecordAttribute,
  RecordAttributeKeys,
  ExtendedValue
} from 'v1/schema/attributes'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { ParsedValue } from './parser'
import type {
  ParsedValueOptions,
  ParsedValueDefaultOptions,
  ParsingOptions,
  FromParsingOptions
} from './types'
import { attrParser, AttrParsedValue, MustBeDefined } from './attribute'

export type RecordAttrParsedValue<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions,
  KEYS extends string = Extract<AttrParsedValue<ATTRIBUTE['keys'], OPTIONS>, string>
> = RecordAttribute extends ATTRIBUTE
  ? { [KEY: string]: unknown }
  : // We cannot use Record type as it messes up map resolution down the line

    | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | {
          [KEY in KEYS]?: AttrParsedValue<ATTRIBUTE['elements'], OPTIONS>
        }
      | ExtendedValue<NonNullable<OPTIONS['extension']>, 'record'>

export function* recordAttributeParser<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends ParsingOptions = ParsingOptions
>(
  attribute: ATTRIBUTE,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  RecordAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  RecordAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
> {
  type Parsed = RecordAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>

  const { fill = true, transform = true } = options

  const parsers: [
    Generator<
      ParsedValue<RecordAttributeKeys, FromParsingOptions<OPTIONS>>,
      ParsedValue<RecordAttributeKeys, FromParsingOptions<OPTIONS>>,
      undefined
    >,
    Generator<
      ParsedValue<Attribute, FromParsingOptions<OPTIONS>>,
      ParsedValue<Attribute, FromParsingOptions<OPTIONS>>,
      ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
    >
  ][] = []

  const isInputValueObject = isObject(inputValue)
  if (isInputValueObject) {
    for (const [key, element] of Object.entries(inputValue)) {
      parsers.push([
        attrParser(attribute.keys, key, options),
        attrParser(attribute.elements, element, options)
      ])
    }
  }

  if (fill) {
    if (isInputValueObject) {
      const defaultedValue = Object.fromEntries(
        parsers
          .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
          .filter(([, element]) => element !== undefined)
      )
      const itemInput = yield defaultedValue as Parsed

      const linkedValue = Object.fromEntries(
        parsers
          .map(([keyParser, elementParser]) => [
            keyParser.next().value,
            elementParser.next(itemInput).value
          ])
          .filter(([, element]) => element !== undefined)
      )
      yield linkedValue as Parsed
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue as Parsed

      const linkedValue = defaultedValue
      yield linkedValue as Parsed
    }
  }

  if (!isInputValueObject) {
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

  const parsedValue = Object.fromEntries(
    parsers
      .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
      .filter(([, element]) => element !== undefined)
  )

  if (transform) {
    yield parsedValue as Parsed
  } else {
    return parsedValue as Parsed
  }

  const transformedValue = Object.fromEntries(
    parsers
      .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
      .filter(([, element]) => element !== undefined)
  )
  return transformedValue as Parsed
}
