import cloneDeep from 'lodash.clonedeep'

import type {
  MapAttribute,
  MapAttributeBasicValue,
  AttributeBasicValue,
  Extension,
  AttributeValue
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
): Generator<MapAttributeBasicValue<INPUT_EXTENSION>, MapAttributeBasicValue<INPUT_EXTENSION>> {
  const { filters } = options
  const parsers: Record<string, Generator<AttributeValue<INPUT_EXTENSION>>> = {}
  let additionalAttributeNames: Set<string> = new Set()

  const isInputValueObject = isObject(inputValue)
  if (isInputValueObject) {
    additionalAttributeNames = new Set(Object.keys(inputValue))

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
  }

  const clonedValue = isInputValueObject
    ? {
        ...Object.fromEntries(
          [...additionalAttributeNames.values()].map(attributeName => {
            const additionalAttribute = mapAttribute.attributes[attributeName]

            const clonedAttributeValue =
              additionalAttribute !== undefined
                ? parseAttributeClonedInput(
                    additionalAttribute,
                    inputValue[attributeName],
                    options
                  ).next().value
                : cloneDeep(inputValue[attributeName])

            return [attributeName, clonedAttributeValue]
          })
        ),
        ...Object.fromEntries(
          Object.entries(parsers)
            .map(([attributeName, attribute]) => [attributeName, attribute.next().value])
            .filter(([, attributeValue]) => attributeValue !== undefined)
        )
      }
    : cloneDeep(inputValue)
  yield clonedValue

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
