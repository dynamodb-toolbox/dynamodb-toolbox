import type { SetAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isSet } from '~/utils/validation/isSet.js'

import { attrParser } from './attribute.js'
import type { ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { applyCustomValidation } from './utils.js'

export function* setAttrParser<OPTIONS extends ParseAttrValueOptions = {}>(
  attribute: SetAttribute,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<SetAttribute, OPTIONS>, ParserReturn<SetAttribute, OPTIONS>> {
  const { valuePath = [], ...restOptions } = options
  const { fill = true, transform = true } = restOptions

  let parsers: Generator<any, any>[] = []

  const isInputValueSet = isSet(inputValue)
  if (isInputValueSet) {
    parsers = [...inputValue.values()].map((element, index) =>
      attrParser(attribute.elements, element, {
        ...restOptions,
        valuePath: [...valuePath, index],
        defined: false
      })
    )
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
    const { type } = attribute
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${path !== undefined ? ` '${path}'` : ''} should be a ${type}.`,
      path,
      payload: { received: inputValue, expected: type }
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
