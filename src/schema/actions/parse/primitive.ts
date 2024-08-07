import type {
  ExtendedValue,
  PrimitiveAttribute,
  ResolvePrimitiveAttributeType,
  ResolvedPrimitiveAttribute,
  Transformer
} from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'
import type { If } from '~/types/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { validatorsByPrimitiveType } from '~/utils/validation/validatorsByPrimitiveType.js'

import type { MustBeDefined } from './attribute.js'
import type { ParsedValue } from './parser.js'
import type {
  FromParsingOptions,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingOptions
} from './types/options.js'
import { runCustomValidation } from './utils.js'

export type PrimitiveAttrParsedValue<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = PrimitiveAttribute extends ATTRIBUTE
  ? ResolvedPrimitiveAttribute
  : ATTRIBUTE extends { transform: undefined }
    ?
        | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
        | (ATTRIBUTE['enum'] extends ResolvePrimitiveAttributeType<ATTRIBUTE['type']>[]
            ? ATTRIBUTE['enum'][number]
            : ResolvePrimitiveAttributeType<ATTRIBUTE['type']>)
        | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
    : OPTIONS extends { transform: false }
      ?
          | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
          | (ATTRIBUTE['enum'] extends ResolvePrimitiveAttributeType<ATTRIBUTE['type']>[]
              ? ATTRIBUTE['enum'][number]
              : ResolvePrimitiveAttributeType<ATTRIBUTE['type']>)
          | ExtendedValue<NonNullable<OPTIONS['extension']>, ATTRIBUTE['type']>
      : ResolvePrimitiveAttributeType<ATTRIBUTE['type']>

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

  if (
    attribute.enum !== undefined &&
    !attribute.enum.includes(linkedValue as ResolvedPrimitiveAttribute)
  ) {
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

  /**
   * @debt type "validator should act as typeguard"
   */
  const parsedValue = linkedValue as ResolvedPrimitiveAttribute
  runCustomValidation(attribute, parsedValue, options)

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
