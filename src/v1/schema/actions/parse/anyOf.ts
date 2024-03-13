import cloneDeep from 'lodash.clonedeep'

import type {
  Schema,
  Attribute,
  AnyOfAttribute,
  AnyOfAttributeElements,
  ExtendedValue
} from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsedValue } from './parser'
import type {
  ParsedValueOptions,
  ParsedValueDefaultOptions,
  ParsingOptions,
  FromParsingOptions
} from './types'
import { attrParser, AttrParsedValue, MustBeDefined } from './attribute'

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
  OPTIONS extends ParsedValueOptions = ParsedValueOptions,
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

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = parser.next().value
  return transformedValue
}
