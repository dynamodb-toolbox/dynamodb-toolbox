import cloneDeep from 'lodash.clonedeep'

import type {
  Extension,
  Item,
  PrimitiveAttribute,
  AttributeValue,
  PrimitiveAttributeBasicValue,
  ResolvedPrimitiveAttribute,
  Transformer
} from 'v1/schema'
import type { If } from 'v1/types'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension, ParsingOptions } from './types'

export function* primitiveAttributeParser<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: PrimitiveAttribute,
  inputValue: AttributeValue<INPUT_EXTENSION>,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  PrimitiveAttributeBasicValue,
  PrimitiveAttributeBasicValue,
  Item<SCHEMA_EXTENSION> | undefined
> {
  const { fill = true, transform = true } = options

  const linkedValue: AttributeValue<INPUT_EXTENSION> = inputValue

  if (fill) {
    const defaultedValue = cloneDeep(inputValue) as PrimitiveAttributeBasicValue
    yield defaultedValue

    const linkedValue = defaultedValue
    yield linkedValue
  }

  const validator = validatorsByPrimitiveType[attribute.type]
  if (!validator(linkedValue)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${attribute.path} should be a ${attribute.type}`,
      path: attribute.path,
      payload: {
        received: linkedValue,
        expected: attribute.type
      }
    })
  }

  if (
    attribute.enum !== undefined &&
    !attribute.enum.includes(linkedValue as ResolvedPrimitiveAttribute)
  ) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${attribute.path} should be one of: ${attribute.enum
        .map(String)
        .join(', ')}`,
      path: attribute.path,
      payload: {
        received: linkedValue,
        expected: attribute.enum
      }
    })
  }

  /**
   * @debt type "validator should act as typeguard"
   */
  const parsedValue = linkedValue as PrimitiveAttributeBasicValue

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue =
    attribute.transform !== undefined
      ? (attribute.transform as Transformer).parse(parsedValue)
      : parsedValue
  return transformedValue
}
