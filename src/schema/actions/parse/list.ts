import type { ListAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isArray } from '~/utils/validation/isArray.js'

import { attrParser } from './attribute.js'
import type { ParseValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { applyCustomValidation } from './utils.js'

export function* listAttrParser<OPTIONS extends ParseValueOptions = {}>(
  attribute: ListAttribute,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<ListAttribute, OPTIONS>, ParserReturn<ListAttribute, OPTIONS>> {
  const { fill = true, transform = true } = options

  const parsers: Generator<any, any>[] = []

  const isInputValueArray = isArray(inputValue)
  if (isInputValueArray) {
    for (const element of inputValue) {
      parsers.push(attrParser(attribute.elements, element, { ...options, defined: false }))
    }
  }

  if (fill) {
    if (isInputValueArray) {
      const defaultedValue = parsers.map(parser => parser.next().value)
      const itemInput = yield defaultedValue

      const linkedValue = parsers.map(parser => parser.next(itemInput).value)
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue as ParserYield<ListAttribute, OPTIONS>

      const linkedValue = defaultedValue
      yield linkedValue as ParserYield<ListAttribute, OPTIONS>
    }
  }

  if (!isInputValueArray) {
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

  const parsedValue = parsers.map(parser => parser.next().value)
  if (parsedValue !== undefined) {
    applyCustomValidation(attribute, parsedValue, options)
  }

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = parsers.map(parser => parser.next().value)
  return transformedValue
}
