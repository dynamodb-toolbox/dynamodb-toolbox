import type {
  ExtendedValue,
  NumberAttribute,
  PrimitiveAttribute,
  ResolveNumberAttribute,
  ResolvePrimitiveAttribute,
  ResolvePrimitiveAttributeType,
  ResolvedNumberAttribute,
  ResolvedPrimitiveAttribute,
  Transformer
} from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'
import type { If } from '~/types/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { validatorsByPrimitiveType } from '~/utils/validation/validatorsByPrimitiveType.js'

import type { MustBeDefined, MustBeProvided } from './attribute.js'
import type { ParsedValue } from './parser.js'
import type {
  FromParsingOptions,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingOptions
} from './types/options.js'
import { applyCustomValidation } from './utils.js'

export type PrimitiveOrNumberAttrParsedValue<
  ATTRIBUTE extends PrimitiveAttribute | NumberAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = PrimitiveAttribute extends ATTRIBUTE
  ? ResolvedPrimitiveAttribute
  : ATTRIBUTE extends { transform: undefined }
    ?
        | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
        | (ATTRIBUTE extends PrimitiveAttribute
            ? ResolvePrimitiveAttribute<ATTRIBUTE>
            : ATTRIBUTE extends NumberAttribute
              ? ResolveNumberAttribute<ATTRIBUTE>
              : never)
        | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
    : OPTIONS extends { transform: false }
      ?
          | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
          | (ATTRIBUTE extends PrimitiveAttribute
              ? ResolvePrimitiveAttribute<ATTRIBUTE>
              : ATTRIBUTE extends NumberAttribute
                ? ResolveNumberAttribute<ATTRIBUTE>
                : never)
          | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
      : ATTRIBUTE extends PrimitiveAttribute
        ? ResolvePrimitiveAttributeType<ATTRIBUTE['type']>
        : ATTRIBUTE extends NumberAttribute
          ? ResolveNumberAttribute<ATTRIBUTE>
          : never

export function* primitiveOrNumberAttrParser<
  ATTRIBUTE extends PrimitiveAttribute | NumberAttribute,
  OPTIONS extends ParsingOptions = ParsingOptions
>(
  attribute: ATTRIBUTE,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  PrimitiveOrNumberAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  PrimitiveOrNumberAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
> {
  type Parsed = PrimitiveOrNumberAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>

  const { fill = true, transform = true } = options

  const linkedValue = inputValue

  if (fill) {
    const defaultedValue = cloneDeep(inputValue)
    yield defaultedValue as Parsed

    const linkedValue = defaultedValue
    yield linkedValue as Parsed
  }

  const validator = validatorsByPrimitiveType[attribute.type]
  if (!validator(linkedValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${path !== undefined ? `'${path}' ` : ''}should be a ${type}.`,
      path,
      payload: {
        received: linkedValue,
        expected: type
      }
    })
  }

  if (attribute.enum !== undefined && !attribute.enum.includes(linkedValue as any)) {
    const { path } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${
        path !== undefined ? `'${path}' ` : ''
      }should be one of: ${attribute.enum.map(String).join(', ')}.`,
      path,
      payload: {
        received: linkedValue,
        expected: attribute.enum
      }
    })
  }

  const parsedValue = linkedValue
  applyCustomValidation(attribute, parsedValue, options)

  if (transform) {
    yield parsedValue as Parsed
  } else {
    return parsedValue as Parsed
  }

  const transformedValue =
    attribute.transform !== undefined
      ? (attribute.transform as Transformer).parse(parsedValue)
      : parsedValue
  return transformedValue as Parsed
}

export type PrimitiveOrNumberAttrParserInput<
  ATTRIBUTE extends PrimitiveAttribute | NumberAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = PrimitiveAttribute | NumberAttribute extends ATTRIBUTE
  ?
      | undefined
      | ResolvedPrimitiveAttribute
      | ResolvedNumberAttribute
      | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | (ATTRIBUTE extends PrimitiveAttribute
          ? ResolvePrimitiveAttribute<ATTRIBUTE>
          : ATTRIBUTE extends NumberAttribute
            ? ResolveNumberAttribute<ATTRIBUTE>
            : never)
      | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
