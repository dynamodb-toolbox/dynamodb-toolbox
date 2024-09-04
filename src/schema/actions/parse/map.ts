import type {
  AnyAttribute,
  Attribute,
  ExtendedValue,
  MapAttribute,
  Never
} from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'
import type { If, OptionalizeUndefinableProperties } from '~/types/index.js'
import type { SelectKeys } from '~/types/selectKeys.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isObject } from '~/utils/validation/isObject.js'

import { attrParser } from './attribute.js'
import type { AttrParsedValue, MustBeDefined } from './attribute.js'
import type { ParsedValue } from './parser.js'
import type {
  FromParsingOptions,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingOptions
} from './types/options.js'
import { applyCustomValidation } from './utils.js'

export type MapAttrParsedValue<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = MapAttribute extends ATTRIBUTE
  ? { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | OptionalizeUndefinableProperties<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<ATTRIBUTE['attributes'], { key: true }>
              : keyof ATTRIBUTE['attributes'] & string as OPTIONS extends { transform: false }
              ? KEY
              : ATTRIBUTE['attributes'][KEY] extends { savedAs: string }
                ? ATTRIBUTE['attributes'][KEY]['savedAs']
                : KEY]: AttrParsedValue<ATTRIBUTE['attributes'][KEY], OPTIONS>
          },
          // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
          SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
        >
      | ExtendedValue<NonNullable<OPTIONS['extension']>, 'map'>

export function* mapAttributeParser<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends ParsingOptions = ParsingOptions
>(
  attribute: ATTRIBUTE,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  MapAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  MapAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
> {
  type Parsed = MapAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>

  const { mode = 'put', fill = true, transform = true } = options
  const parsers: Record<
    string,
    Generator<
      ParsedValue<Attribute, FromParsingOptions<OPTIONS>>,
      ParsedValue<Attribute, FromParsingOptions<OPTIONS>>,
      ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
    >
  > = {}
  let restEntries: [string, unknown][] = []

  const isInputValueObject = isObject(inputValue)
  if (isInputValueObject) {
    const additionalAttributeNames = new Set(Object.keys(inputValue))

    Object.entries(attribute.attributes)
      .filter(([, attr]) => mode !== 'key' || attr.key)
      .forEach(([attrName, attr]) => {
        parsers[attrName] = attrParser(attr, inputValue[attrName], options)

        additionalAttributeNames.delete(attrName)
      })

    restEntries = [...additionalAttributeNames.values()].map(attrName => [
      attrName,
      cloneDeep(inputValue[attrName])
    ])
  }

  if (fill) {
    if (isInputValueObject) {
      const defaultedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attrName, attr]) => [attrName, attr.next().value])
          .filter(([, filledAttrValue]) => filledAttrValue !== undefined),
        ...restEntries
      ])
      const itemInput = yield defaultedValue

      const linkedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attrName, parser]) => [attrName, parser.next(itemInput).value])
          .filter(([, linkedAttrValue]) => linkedAttrValue !== undefined),
        ...restEntries
      ])
      yield linkedValue
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
    Object.entries(parsers)
      .map(([attrName, attrParser]) => [attrName, attrParser.next().value])
      .filter(([, attrValue]) => attrValue !== undefined)
  )
  applyCustomValidation(attribute, parsedValue, options)

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = Object.fromEntries(
    Object.entries(parsers)
      .map(([attrName, attrParser]) => [
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attribute.attributes[attrName]!.savedAs ?? attrName,
        attrParser.next().value
      ])
      .filter(([, attrValue]) => attrValue !== undefined)
  )
  return transformedValue
}
