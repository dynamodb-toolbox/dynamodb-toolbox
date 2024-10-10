import type { PrimitiveAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Transformer } from '~/transformers/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { ParsingOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { applyCustomValidation } from './utils.js'

export function* primitiveAttrParser<OPTIONS extends ParsingOptions = {}>(
  attribute: PrimitiveAttribute,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<PrimitiveAttribute, OPTIONS>, ParserReturn<PrimitiveAttribute, OPTIONS>> {
  const { fill = true, transform = true } = options

  const linkedValue = inputValue

  if (fill) {
    const defaultedValue = cloneDeep(inputValue)
    yield defaultedValue as ParserYield<PrimitiveAttribute, OPTIONS>

    const linkedValue = defaultedValue
    yield linkedValue as ParserYield<PrimitiveAttribute, OPTIONS>
  }

  if (!isValidPrimitive(attribute, linkedValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${path !== undefined ? `'${path}' ` : ''}should be a ${type}.`,
      path,
      payload: { received: linkedValue, expected: type }
    })
  }

  if (attribute.enum !== undefined && !(attribute.enum as unknown[]).includes(linkedValue)) {
    const { path } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${
        path !== undefined ? `'${path}' ` : ''
      }should be one of: ${attribute.enum.map(String).join(', ')}.`,
      path,
      payload: { received: linkedValue, expected: attribute.enum }
    })
  }

  const parsedValue = linkedValue
  applyCustomValidation(attribute, parsedValue, options)

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue =
    attribute.transform !== undefined
      ? (attribute.transform as Transformer).parse(parsedValue)
      : parsedValue
  return transformedValue
}
