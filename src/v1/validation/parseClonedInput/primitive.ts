import cloneDeep from 'lodash.clonedeep'

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

export function* parsePrimitiveAttributeClonedInput<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  primitiveAttribute: PrimitiveAttribute,
  inputValue: AttributeBasicValue<INPUT_EXTENSION>,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<PrimitiveAttributeBasicValue, PrimitiveAttributeBasicValue> {
  const clonedValue = cloneDeep(inputValue)
  yield clonedValue as PrimitiveAttributeBasicValue

  const { transform = true } = options

  const validator = validatorsByPrimitiveType[primitiveAttribute.type]
  if (!validator(clonedValue)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${primitiveAttribute.path} should be a ${primitiveAttribute.type}`,
      path: primitiveAttribute.path,
      payload: {
        received: clonedValue,
        expected: primitiveAttribute.type
      }
    })
  }

  if (
    primitiveAttribute.enum !== undefined &&
    !primitiveAttribute.enum.includes(clonedValue as ResolvedPrimitiveAttribute)
  ) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${
        primitiveAttribute.path
      } should be one of: ${primitiveAttribute.enum.map(String).join(', ')}`,
      path: primitiveAttribute.path,
      payload: {
        received: clonedValue,
        expected: primitiveAttribute.enum
      }
    })
  }

  /**
   * @debt type "validator should act as typeguard"
   */
  const parsedValue = clonedValue as PrimitiveAttributeBasicValue
  yield parsedValue

  const collapsedValue =
    transform && primitiveAttribute.transform !== undefined
      ? (primitiveAttribute.transform as Transformer).parse(parsedValue)
      : parsedValue

  return collapsedValue
}
