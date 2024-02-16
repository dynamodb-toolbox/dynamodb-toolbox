import cloneDeep from 'lodash.clonedeep'
import type { O } from 'ts-toolbelt'

import type { Schema, Attribute, AnyAttribute, Extension, Never } from 'v1/schema'
import type { If, OptionalizeUndefinableProperties, IsConstraint } from 'v1/types'
import { isObject } from 'v1/utils/validation/isObject'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension, ParsingOptions } from './types'
import type { ValidValue } from './parser'
import { attrWorkflow, ValidAttrValue } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'

export type ValidSchemaValue<SCHEMA extends Schema, EXTENSION extends Extension = never> = If<
  IsConstraint<SCHEMA, Schema>,
  { [KEY in string]: ValidAttrValue<Attribute, EXTENSION> },
  OptionalizeUndefinableProperties<
    {
      [KEY in keyof SCHEMA['attributes'] & string]: ValidAttrValue<
        SCHEMA['attributes'][KEY],
        EXTENSION
      >
    },
    // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
    O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: Never }>
  >
>

export function* schemaWorkflow<SCHEMA extends Schema, EXTENSION extends Extension = never>(
  schema: SCHEMA,
  inputValue: unknown,
  ...[options = {} as ParsingOptions<EXTENSION, EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: ParsingOptions<EXTENSION, EXTENSION>],
    [options?: ParsingOptions<EXTENSION, EXTENSION>]
  >
): Generator<ValidValue<SCHEMA, EXTENSION>, ValidValue<SCHEMA, EXTENSION>> {
  const { filters, fill = true, transform = true } = options
  const parsers: Record<string, Generator<ValidValue<Attribute, EXTENSION>>> = {}
  let restEntries: [string, ValidValue<Attribute, EXTENSION>][] = []

  const isInputValueObject = isObject(inputValue)

  if (isInputValueObject) {
    const additionalAttributeNames = new Set(Object.keys(inputValue))

    Object.entries(schema.attributes)
      .filter(([, attr]) => doesAttributeMatchFilters(attr, filters))
      .forEach(([attrName, attr]) => {
        parsers[attrName] = attrWorkflow(attr, inputValue[attrName], options)

        additionalAttributeNames.delete(attrName)
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
          .map(([attrName, attr]) => [attrName, attr.next().value])
          .filter(([, defaultedAttrValue]) => defaultedAttrValue !== undefined),
        ...restEntries
      ])
      yield defaultedValue

      const linkedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attrName, parser]) => [attrName, parser.next(defaultedValue).value])
          .filter(([, linkedAttrValue]) => linkedAttrValue !== undefined),
        ...restEntries
      ])
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue as any

      const linkedValue = defaultedValue
      yield linkedValue as any
    }
  }

  if (!isInputValueObject) {
    throw new DynamoDBToolboxError('parsing.invalidItem', {
      message: 'Items should be objects',
      payload: {
        received: inputValue,
        expected: 'object'
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
        schema.attributes[attrName].savedAs ?? attrName,
        attr.next().value
      ])
      .filter(([, attrValue]) => attrValue !== undefined)
  )
  return transformedValue
}
