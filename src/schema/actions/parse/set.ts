import type { SetAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isSet } from '~/utils/validation/isSet.js'

import { attrParser } from './attribute.js'
import type { ParseValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { applyCustomValidation } from './utils.js'

export function* setAttrParser<OPTIONS extends ParseValueOptions = {}>(
  attribute: SetAttribute,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<SetAttribute, OPTIONS>, ParserReturn<SetAttribute, OPTIONS>> {
  const { fill = true, transform = true } = options

  const parsers: Generator<any, any>[] = []

  const isInputValueSet = isSet(inputValue)
  if (isInputValueSet) {
    for (const element of inputValue.values()) {
      parsers.push(attrParser(attribute.elements, element, { ...options, defined: false }))
    }
  }

  if (fill) {
    if (isInputValueSet) {
      const defaultedValue = new Set(parsers.map(parser => parser.next().value))
      yield defaultedValue

      const linkedValue = new Set(parsers.map(parser => parser.next().value))
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue as ParserYield<SetAttribute, OPTIONS>

      const linkedValue = defaultedValue
      yield linkedValue as ParserYield<SetAttribute, OPTIONS>
    }
  }

  if (!isInputValueSet) {
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

  const parsedValue = new Set(parsers.map(parser => parser.next().value))
  if (parsedValue !== undefined) {
    applyCustomValidation(attribute, parsedValue, options)
  }

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = new Set(parsers.map(parser => parser.next().value))
  return transformedValue
}
