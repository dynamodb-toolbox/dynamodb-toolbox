import cloneDeep from 'lodash.clonedeep'

import type { AnyOfAttribute, AttributeBasicValue, Extension, AttributeValue } from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'

export function* parseAnyOfAttributeClonedInput<
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
): Generator<AttributeValue<INPUT_EXTENSION>, AttributeValue<INPUT_EXTENSION>> {
  let parser: Generator<AttributeValue<INPUT_EXTENSION>> | undefined = undefined
  let _clonedValue: AttributeValue<INPUT_EXTENSION> | undefined = undefined
  let _parsedValue: AttributeValue<INPUT_EXTENSION> | undefined = undefined

  for (const elementAttribute of attribute.elements) {
    try {
      parser = parseAttributeClonedInput(elementAttribute, inputValue, options)
      _clonedValue = parser.next().value
      _parsedValue = parser.next().value
      break
    } catch (error) {
      parser = undefined
      _clonedValue = undefined
      _parsedValue = undefined
      continue
    }
  }

  const clonedValue = _clonedValue ?? cloneDeep(inputValue)
  yield clonedValue

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

  yield parsedValue

  const collapsedValue = parser.next().value
  return collapsedValue
}
