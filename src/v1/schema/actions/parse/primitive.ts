import cloneDeep from 'lodash.clonedeep'

import type {
  Schema,
  PrimitiveAttribute,
  ResolvePrimitiveAttributeType,
  ResolvedPrimitiveAttribute,
  Extension,
  ExtendedValue,
  Transformer
} from 'v1/schema'
import type { If } from 'v1/types'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ValidValue } from './parser'
import type { HasExtension, ParsingOptions } from './types'

export type ValidPrimitiveAttrValue<
  ATTRIBUTE extends PrimitiveAttribute,
  EXTENSION extends Extension = never
> =
  | (ATTRIBUTE['enum'] extends ResolvePrimitiveAttributeType<ATTRIBUTE['type']>[]
      ? ATTRIBUTE['enum'][number]
      : ResolvePrimitiveAttributeType<ATTRIBUTE['type']>)
  | ExtendedValue<EXTENSION, ATTRIBUTE['type']>

export function* primitiveAttrWorkflow<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: PrimitiveAttribute,
  inputValue: unknown,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  ValidPrimitiveAttrValue<PrimitiveAttribute, INPUT_EXTENSION>,
  ValidPrimitiveAttrValue<PrimitiveAttribute, INPUT_EXTENSION>,
  ValidValue<Schema, SCHEMA_EXTENSION> | undefined
> {
  const { fill = true, transform = true } = options

  const linkedValue = inputValue

  if (fill) {
    const defaultedValue = cloneDeep(inputValue)
    yield defaultedValue

    const linkedValue = defaultedValue
    yield linkedValue
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
