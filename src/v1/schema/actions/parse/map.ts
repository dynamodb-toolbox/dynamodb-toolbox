import cloneDeep from 'lodash.clonedeep'
import type { O } from 'ts-toolbelt'

import type {
  Schema,
  Attribute,
  AnyAttribute,
  MapAttribute,
  Extension,
  ExtendedValue,
  Never
} from 'v1/schema'
import type { If, OptionalizeUndefinableProperties } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { ValidValue } from './parser'
import type { HasExtension, ParsingOptions } from './types'
import { attrWorkflow, ValidAttrValue } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'

export type ValidMapAttrValue<
  ATTRIBUTE extends MapAttribute,
  EXTENSION extends Extension = never
> =
  | OptionalizeUndefinableProperties<
      {
        [KEY in keyof ATTRIBUTE['attributes'] & string]: ValidAttrValue<
          ATTRIBUTE['attributes'][KEY],
          EXTENSION
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      O.SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
    >
  | ExtendedValue<EXTENSION, 'map'>

export function* mapAttributeParser<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: MapAttribute,
  inputValue: unknown,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  ValidMapAttrValue<MapAttribute, INPUT_EXTENSION>,
  ValidMapAttrValue<MapAttribute, INPUT_EXTENSION>,
  ValidValue<Schema, SCHEMA_EXTENSION> | undefined
> {
  const { filters, fill = true, transform = true } = options
  const parsers: Record<
    string,
    Generator<
      ValidValue<Attribute, INPUT_EXTENSION>,
      ValidValue<Attribute, INPUT_EXTENSION>,
      ValidValue<Schema, SCHEMA_EXTENSION> | undefined
    >
  > = {}
  let restEntries: [string, unknown][] = []

  const isInputValueObject = isObject(inputValue)
  if (isInputValueObject) {
    const additionalAttributeNames = new Set(Object.keys(inputValue))

    Object.entries(attribute.attributes)
      .filter(([, attr]) => doesAttributeMatchFilters(attr, filters))
      .forEach(([attrName, attr]) => {
        parsers[attrName] = attrWorkflow(attr, inputValue[attrName], options)

        additionalAttributeNames.delete(attrName)
      })

    restEntries = [...additionalAttributeNames.values()].map(attrName => [
      attrName,
      cloneDeep(inputValue[attrName])
    ])
  }

  if (fill) {
    if (isInputValueObject) {
      const defaultedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attrName, attr]) => [attrName, attr.next().value])
          .filter(([, filledAttrValue]) => filledAttrValue !== undefined),
        ...restEntries
      ])
      const itemInput = yield defaultedValue

      const linkedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attrName, parser]) => [attrName, parser.next(itemInput).value])
          .filter(([, linkedAttrValue]) => linkedAttrValue !== undefined),
        ...restEntries
      ])
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue

      const linkedValue = defaultedValue
      yield linkedValue
    }
  }

  if (!isInputValueObject) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${path !== undefined ? `'${path}' ` : ''}should be a ${type}.`,
      path,
      payload: {
        received: inputValue,
        expected: type
      }
    })
  }

  const parsedValue = Object.fromEntries(
    Object.entries(parsers)
      .map(([attrName, attr]) => [attrName, attr.next().value])
      .filter(([, attrValue]) => attrValue !== undefined)
  )

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = Object.fromEntries(
    Object.entries(parsers)
      .map(([attrName, attr]) => [
        attribute.attributes[attrName].savedAs ?? attrName,
        attr.next().value
      ])
      .filter(([, attrValue]) => attrValue !== undefined)
  )
  return transformedValue
}
