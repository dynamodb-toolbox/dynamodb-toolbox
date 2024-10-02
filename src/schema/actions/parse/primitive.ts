import type { Call } from 'hotscript'

import type {
  BinaryAttribute,
  BooleanAttribute,
  ExtendedValue,
  NullAttribute,
  NumberAttribute,
  PrimitiveAttribute,
  ResolveBinaryAttribute,
  ResolveBooleanAttribute,
  ResolveNumberAttribute,
  ResolvePrimitiveAttribute,
  ResolveStringAttribute,
  ResolvedNullAttribute,
  ResolvedPrimitiveAttribute,
  StringAttribute
} from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'
import type { Transformer, TypeModifier } from '~/transformers/index.js'
import type { If } from '~/types/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { MustBeDefined, MustBeProvided } from './attribute.js'
import type { ParsedValue } from './parser.js'
import type {
  FromParsingOptions,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingOptions
} from './types/options.js'
import { applyCustomValidation } from './utils.js'

export type PrimitiveAttrParsedValue<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = PrimitiveAttribute extends ATTRIBUTE
  ?
      | undefined
      | ResolvedPrimitiveAttribute
      | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
  : ATTRIBUTE extends { transform: undefined }
    ?
        | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
        | ResolvePrimitiveAttribute<ATTRIBUTE>
        | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
    : OPTIONS extends { transform: false }
      ?
          | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
          | ResolvePrimitiveAttribute<ATTRIBUTE>
          | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
      :
          | (ATTRIBUTE extends NullAttribute ? ResolvedNullAttribute : never)
          | (ATTRIBUTE extends NumberAttribute
              ? ATTRIBUTE extends { transform: Transformer }
                ? Call<TypeModifier<ATTRIBUTE['transform']>, ResolveNumberAttribute<ATTRIBUTE>>
                : ResolveNumberAttribute<ATTRIBUTE>
              : never)
          | (ATTRIBUTE extends BooleanAttribute
              ? ATTRIBUTE extends { transform: Transformer }
                ? Call<TypeModifier<ATTRIBUTE['transform']>, ResolveBooleanAttribute<ATTRIBUTE>>
                : ResolveBooleanAttribute<ATTRIBUTE>
              : never)
          | (ATTRIBUTE extends StringAttribute
              ? ATTRIBUTE extends { transform: Transformer }
                ? Call<TypeModifier<ATTRIBUTE['transform']>, ResolveStringAttribute<ATTRIBUTE>>
                : ResolveStringAttribute<ATTRIBUTE>
              : never)
          | (ATTRIBUTE extends BinaryAttribute
              ? ATTRIBUTE extends { transform: Transformer }
                ? Call<TypeModifier<ATTRIBUTE['transform']>, ResolveBinaryAttribute<ATTRIBUTE>>
                : ResolveBinaryAttribute<ATTRIBUTE>
              : never)

export function* primitiveAttrParser<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends ParsingOptions = ParsingOptions
>(
  attribute: ATTRIBUTE,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  PrimitiveAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  PrimitiveAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
> {
  type Parsed = PrimitiveAttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>

  const { fill = true, transform = true } = options

  const linkedValue = inputValue

  if (fill) {
    const defaultedValue = cloneDeep(inputValue)
    yield defaultedValue as Parsed

    const linkedValue = defaultedValue
    yield linkedValue as Parsed
  }

  if (!isValidPrimitive(attribute, linkedValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${path !== undefined ? `'${path}' ` : ''}should be a ${type}.`,
      path,
      payload: { received: linkedValue, expected: type }
    })
  }

  if (attribute.enum !== undefined && !(attribute.enum as unknown[]).includes(linkedValue)) {
    const { path } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${
        path !== undefined ? `'${path}' ` : ''
      }should be one of: ${attribute.enum.map(String).join(', ')}.`,
      path,
      payload: { received: linkedValue, expected: attribute.enum }
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

export type PrimitiveAttrParserInput<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = PrimitiveAttribute extends ATTRIBUTE
  ?
      | undefined
      | ResolvedPrimitiveAttribute
      | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | ResolvePrimitiveAttribute<ATTRIBUTE>
      | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
