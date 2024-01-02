import type {
  PrimitiveAttribute,
  PrimitiveAttributeBasicValue,
  AttributeBasicValue,
  ResolvedPrimitiveAttribute,
  Extension,
  Transformer
} from 'v1/schema'
import type { If } from 'v1/types'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension } from '../types'
import type { ParsingOptions } from './types'

// eslint-disable-next-line require-yield
export function* parsePrimitiveAttributeClonedInput<EXTENSION extends Extension>(
  primitiveAttribute: PrimitiveAttribute,
  input: AttributeBasicValue<EXTENSION>,
  ...[parsingOptions = {} as ParsingOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: ParsingOptions<EXTENSION>],
    [options?: ParsingOptions<EXTENSION>]
  >
): Generator<PrimitiveAttributeBasicValue, PrimitiveAttributeBasicValue> {
  const { transform = true } = parsingOptions

  const validator = validatorsByPrimitiveType[primitiveAttribute.type]
  if (!validator(input)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${primitiveAttribute.path} should be a ${primitiveAttribute.type}`,
      path: primitiveAttribute.path,
      payload: {
        received: input,
        expected: primitiveAttribute.type
      }
    })
  }

  if (
    primitiveAttribute.enum !== undefined &&
    !primitiveAttribute.enum.includes(input as ResolvedPrimitiveAttribute)
  ) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${
        primitiveAttribute.path
      } should be one of: ${primitiveAttribute.enum.map(String).join(', ')}`,
      path: primitiveAttribute.path,
      payload: {
        received: input,
        expected: primitiveAttribute.enum
      }
    })
  }

  /**
   * @debt type "validator should act as typeguard"
   */
  const parsedInput = input as PrimitiveAttributeBasicValue

  yield parsedInput as PrimitiveAttributeBasicValue

  return transform && primitiveAttribute.transform !== undefined
    ? (primitiveAttribute.transform as Transformer).parse(parsedInput)
    : parsedInput
}
