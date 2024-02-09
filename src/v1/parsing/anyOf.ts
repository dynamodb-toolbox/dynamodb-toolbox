import cloneDeep from 'lodash.clonedeep'

import type {
  AnyOfAttribute,
  Extension,
  AttributeValue,
  AttributeBasicValue,
  Item
} from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension, ParsingOptions } from './types'
import { attributeParser } from './attribute'

export function* anyOfAttributeParser<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: AnyOfAttribute,
  inputValue: AttributeBasicValue<INPUT_EXTENSION>,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  AttributeBasicValue<INPUT_EXTENSION>,
  AttributeBasicValue<INPUT_EXTENSION>,
  Item<SCHEMA_EXTENSION> | undefined
> {
  const { fill = true, transform = true } = options

  let parser: Generator<AttributeValue<INPUT_EXTENSION>> | undefined = undefined
  let _defaultedValue: AttributeBasicValue<INPUT_EXTENSION> | undefined = undefined
  let _linkedValue: AttributeBasicValue<INPUT_EXTENSION> | undefined = undefined
  let _parsedValue: AttributeBasicValue<INPUT_EXTENSION> | undefined = undefined

  for (const elementAttribute of attribute.elements) {
    try {
      parser = attributeParser(elementAttribute, inputValue, options)
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
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${attribute.path} does not match any of the possible sub-types`,
      path: attribute.path,
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