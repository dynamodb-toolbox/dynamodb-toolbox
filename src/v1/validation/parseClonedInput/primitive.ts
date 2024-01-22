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

import type { HasExtension } from '../types'
import type { ParsingOptions } from './types'

export function* parsePrimitiveAttributeClonedInput<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  primitiveAttribute: PrimitiveAttribute,
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
  const { transform = true, clone = true } = options

  const linkedValue: AttributeValue<INPUT_EXTENSION> = inputValue

  if (clone) {
    const clonedValue = cloneDeep(inputValue) as PrimitiveAttributeBasicValue
    yield clonedValue

    const linkedValue = clonedValue
    yield linkedValue
  }

  const validator = validatorsByPrimitiveType[primitiveAttribute.type]
  if (!validator(linkedValue)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${primitiveAttribute.path} should be a ${primitiveAttribute.type}`,
      path: primitiveAttribute.path,
      payload: {
        received: linkedValue,
        expected: primitiveAttribute.type
      }
    })
  }

  if (
    primitiveAttribute.enum !== undefined &&
    !primitiveAttribute.enum.includes(linkedValue as ResolvedPrimitiveAttribute)
  ) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${
        primitiveAttribute.path
      } should be one of: ${primitiveAttribute.enum.map(String).join(', ')}`,
      path: primitiveAttribute.path,
      payload: {
        received: linkedValue,
        expected: primitiveAttribute.enum
      }
    })
  }

  /**
   * @debt type "validator should act as typeguard"
   */
  const parsedValue = linkedValue as PrimitiveAttributeBasicValue
  yield parsedValue

  const collapsedValue =
    transform && primitiveAttribute.transform !== undefined
      ? (primitiveAttribute.transform as Transformer).parse(parsedValue)
      : parsedValue

  return collapsedValue
}
