import type {
  AnyOfAttribute,
  AnyOfAttributeElements,
  Attribute,
  ExtendedValue
} from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'
import type { If } from '~/types/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'

import { attrParser } from './attribute.js'
import type {
  AttrParsedValue,
  AttrParserInput,
  MustBeDefined,
  MustBeProvided
} from './attribute.js'
import type { ParsedValue } from './parser.js'
import type {
  FromParsingOptions,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingOptions
} from './types/options.js'
import { applyCustomValidation } from './utils.js'

export type AnyOfAttrParsedValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | ValidAnyOfAttrValueRec<ATTRIBUTE['elements'], OPTIONS>
      | ExtendedValue<NonNullable<OPTIONS['extension']>, 'anyOf'>

type ValidAnyOfAttrValueRec<
  ELEMENTS extends Attribute[],
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions,
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? ValidAnyOfAttrValueRec<
          ELEMENTS_TAIL,
          OPTIONS,
          RESULTS | AttrParsedValue<ELEMENTS_HEAD, OPTIONS>
        >
      : never
    : never
  : [RESULTS] extends [never]
    ? unknown
    : RESULTS

export function* anyOfAttributeParser<OPTIONS extends ParsingOptions = ParsingOptions>(
  attribute: AnyOfAttribute,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  AnyOfAttrParsedValue<AnyOfAttribute, FromParsingOptions<OPTIONS>>,
  AnyOfAttrParsedValue<AnyOfAttribute, FromParsingOptions<OPTIONS>>,
  ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
> {
  const { fill = true, transform = true } = options

  let parser:
    | Generator<
        ParsedValue<AnyOfAttributeElements, FromParsingOptions<OPTIONS>>,
        ParsedValue<AnyOfAttributeElements, FromParsingOptions<OPTIONS>>,
        ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
      >
    | undefined = undefined
  let _defaultedValue = undefined
  let _linkedValue = undefined
  let _parsedValue = undefined

  for (const elementAttribute of attribute.elements) {
    try {
      parser = attrParser(elementAttribute, inputValue, options)
      if (fill) {
        _defaultedValue = parser.next().value
        // Note: Links cannot be used in anyOf elements or sub elements for this reason (we need the return of the yield)
        _linkedValue = parser.next().value
      }
      _parsedValue = parser.next().value
      break
    } catch (error) {
      parser = undefined
      _defaultedValue = undefined
      _linkedValue = undefined
      _parsedValue = undefined
      continue
    }
  }

  if (fill) {
    const defaultedValue = _defaultedValue ?? cloneDeep(inputValue)
    yield defaultedValue

    const linkedValue = _linkedValue ?? defaultedValue
    yield linkedValue
  }

  const parsedValue = _parsedValue
  if (parser === undefined || parsedValue === undefined) {
    const { path } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${
        path !== undefined ? `'${path}' ` : ''
      }does not match any of the possible sub-types.`,
      path,
      payload: {
        received: inputValue
      }
    })
  }
  applyCustomValidation(attribute, parsedValue, options)

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = parser.next().value
  return transformedValue
}

export type AnyOfAttrParserInput<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrParserInput<ATTRIBUTE['elements'][number], OPTIONS>
      | ExtendedValue<NonNullable<OPTIONS['extension']>, 'anyOf'>
