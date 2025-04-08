import { DynamoDBToolboxError } from '~/errors/index.js'
import type { ItemSchema, Schema } from '~/schema/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { ParseValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { schemaParser } from './schema.js'

export function* itemParser<SCHEMA extends ItemSchema, OPTIONS extends ParseValueOptions = {}>(
  schema: SCHEMA,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<ItemSchema, OPTIONS>, ParserReturn<ItemSchema, OPTIONS>> {
  const { mode = 'put', fill = true, transform = true } = options

  const parsers: Record<
    string,
    Generator<ParserYield<Schema, OPTIONS>, ParserReturn<Schema, OPTIONS>>
  > = {}
  let restEntries: [string, unknown][] = []

  const isInputValueObject = isObject(inputValue)

  if (isInputValueObject) {
    const additionalAttributeNames = new Set(Object.keys(inputValue))

    Object.entries(schema.attributes)
      .filter(([, attr]) => mode !== 'key' || attr.props.key)
      .forEach(([attrName, attr]) => {
        parsers[attrName] = schemaParser(attr, inputValue[attrName], {
          ...options,
          valuePath: [attrName],
          defined: false
        })

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
      yield defaultedValue as ParserYield<ItemSchema, OPTIONS>

      const linkedValue = defaultedValue
      yield linkedValue as ParserYield<ItemSchema, OPTIONS>
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        schema.attributes[attrName]!.props.savedAs ?? attrName,
        attr.next().value
      ])
      .filter(([, attrValue]) => attrValue !== undefined)
  )
  return transformedValue
}
