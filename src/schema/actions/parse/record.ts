import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { RecordSchema } from '~/schema/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isObject } from '~/utils/validation/isObject.js'

import { attrParser } from './attribute.js'
import type { ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { applyCustomValidation } from './utils.js'

export function* recordSchemaParser<OPTIONS extends ParseAttrValueOptions = {}>(
  schema: RecordSchema,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<RecordSchema, OPTIONS>, ParserReturn<RecordSchema, OPTIONS>> {
  const { valuePath = [], ...restOptions } = options
  const { fill = true, transform = true } = restOptions

  const parsers: [Generator<any, any>, Generator<any, any>][] = []
  const undefinedEntries: [string, undefined][] = []
  const missingEnumKeys = new Set(schema.keys.props.enum)

  const isInputValueObject = isObject(inputValue)
  if (isInputValueObject) {
    for (const [key, element] of Object.entries(inputValue)) {
      if (element === undefined) {
        undefinedEntries.push([key, undefined])
        continue
      }

      missingEnumKeys.delete(key)
      const nextValuePath = [...valuePath, key]
      parsers.push([
        attrParser(schema.keys, key, { ...restOptions, valuePath: nextValuePath }),
        attrParser(schema.elements, element, {
          ...restOptions,
          defined: false,
          valuePath: nextValuePath
        })
      ])
    }
  }

  if (!schema.props.partial && options.mode !== 'update') {
    for (const missingKey of missingEnumKeys) {
      const nextValuePath = [...valuePath, missingKey]
      parsers.push([
        attrParser(schema.keys, missingKey, { ...restOptions, valuePath: nextValuePath }),
        attrParser(schema.elements, undefined, {
          ...restOptions,
          defined: false,
          valuePath: nextValuePath
        })
      ])
    }
  }

  if (fill) {
    if (isInputValueObject) {
      const defaultedValue = Object.fromEntries([
        ...parsers
          .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
          .filter(([, element]) => element !== undefined),
        ...undefinedEntries
      ])
      const itemInput = yield defaultedValue

      const linkedValue = Object.fromEntries([
        ...parsers
          .map(([keyParser, elementParser]) => [
            keyParser.next().value,
            elementParser.next(itemInput).value
          ])
          .filter(([, element]) => element !== undefined),
        ...undefinedEntries
      ])
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue as ParserYield<RecordSchema, OPTIONS>

      const linkedValue = defaultedValue
      yield linkedValue as ParserYield<RecordSchema, OPTIONS>
    }
  }

  if (!isInputValueObject) {
    const { type } = schema
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${path !== undefined ? ` '${path}'` : ''} should be a ${type}.`,
      path,
      payload: { received: inputValue, expected: type }
    })
  }

  const parsedValue = Object.fromEntries(
    parsers
      .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
      .filter(([, element]) => element !== undefined)
  )
  if (parsedValue !== undefined) {
    applyCustomValidation(schema, parsedValue, options)
  }

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = Object.fromEntries(
    parsers
      .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
      .filter(([, element]) => element !== undefined)
  )
  return transformedValue
}
