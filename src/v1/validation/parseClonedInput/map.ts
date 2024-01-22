import cloneDeep from 'lodash.clonedeep'

import type {
  Extension,
  Item,
  AttributeValue,
  MapAttribute,
  AttributeBasicValue,
  MapAttributeBasicValue
} from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { HasExtension } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'

export function* parseMapAttributeClonedInput<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  mapAttribute: MapAttribute,
  inputValue: AttributeBasicValue<INPUT_EXTENSION>,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  MapAttributeBasicValue<INPUT_EXTENSION>,
  MapAttributeBasicValue<INPUT_EXTENSION>,
  Item<SCHEMA_EXTENSION> | undefined
> {
  const { filters, clone = true } = options
  const parsers: Record<string, Generator<AttributeValue<INPUT_EXTENSION>>> = {}
  let clonedRestEntries: [string, AttributeValue<INPUT_EXTENSION>][] = []

  const isInputValueObject = isObject(inputValue)
  if (isInputValueObject) {
    const additionalAttributeNames = new Set(Object.keys(inputValue))

    Object.entries(mapAttribute.attributes)
      .filter(([, attribute]) => doesAttributeMatchFilters(attribute, filters))
      .forEach(([attributeName, attribute]) => {
        parsers[attributeName] = parseAttributeClonedInput(
          attribute,
          inputValue[attributeName],
          options
        )

        additionalAttributeNames.delete(attributeName)
      })

    clonedRestEntries = [...additionalAttributeNames.values()].map(attributeName => [
      attributeName,
      cloneDeep(inputValue[attributeName])
    ])
  }

  if (clone) {
    if (isInputValueObject) {
      const clonedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attributeName, attribute]) => [attributeName, attribute.next().value])
          .filter(([, clonedAttributeValue]) => clonedAttributeValue !== undefined),
        ...clonedRestEntries
      ])
      const itemInput = yield clonedValue

      const linkedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attributeName, parser]) => [attributeName, parser.next(itemInput).value])
          .filter(([, linkedAttributeValue]) => linkedAttributeValue !== undefined),
        ...clonedRestEntries
      ])
      yield linkedValue
    } else {
      const clonedValue = (cloneDeep(
        inputValue
      ) as unknown) as MapAttributeBasicValue<INPUT_EXTENSION>
      yield clonedValue

      const linkedValue = clonedValue
      yield linkedValue
    }
  }

  if (!isInputValueObject) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${mapAttribute.path} should be a ${mapAttribute.type}`,
      path: mapAttribute.path,
      payload: {
        received: inputValue,
        expected: mapAttribute.type
      }
    })
  }

  const parsedValue = Object.fromEntries(
    Object.entries(parsers)
      .map(([attributeName, attribute]) => [attributeName, attribute.next().value])
      .filter(([, attributeValue]) => attributeValue !== undefined)
  )
  yield parsedValue

  const collapsedValue = Object.fromEntries(
    Object.entries(parsers)
      .map(([attributeName, attribute]) => [
        mapAttribute.attributes[attributeName].savedAs ?? attributeName,
        attribute.next().value
      ])
      .filter(([, attributeValue]) => attributeValue !== undefined)
  )
  return collapsedValue
}
