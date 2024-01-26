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
  const { filters, fill = true } = options
  const parsers: Record<string, Generator<AttributeValue<INPUT_EXTENSION>>> = {}
  let restEntries: [string, AttributeValue<INPUT_EXTENSION>][] = []

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

    restEntries = [...additionalAttributeNames.values()].map(attributeName => [
      attributeName,
      cloneDeep(inputValue[attributeName])
    ])
  }

  if (fill) {
    if (isInputValueObject) {
      const defaultedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attributeName, attribute]) => [attributeName, attribute.next().value])
          .filter(([, filledAttributeValue]) => filledAttributeValue !== undefined),
        ...restEntries
      ])
      const itemInput = yield defaultedValue

      const linkedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attributeName, parser]) => [attributeName, parser.next(itemInput).value])
          .filter(([, linkedAttributeValue]) => linkedAttributeValue !== undefined),
        ...restEntries
      ])
      yield linkedValue
    } else {
      const defaultedValue = (cloneDeep(
        inputValue
      ) as unknown) as MapAttributeBasicValue<INPUT_EXTENSION>
      yield defaultedValue

      const linkedValue = defaultedValue
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
