import type { PrimitiveSchema } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { Transformer } from '~/transformers/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { applyCustomValidation } from './utils.js'

export function* primitiveAttrParser<OPTIONS extends ParseAttrValueOptions = {}>(
  attribute: PrimitiveSchema,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<PrimitiveSchema, OPTIONS>, ParserReturn<PrimitiveSchema, OPTIONS>> {
  const { fill = true, transform = true, valuePath = [] } = options

  const linkedValue = inputValue

  if (fill) {
    const defaultedValue = cloneDeep(inputValue)
    yield defaultedValue as ParserYield<PrimitiveSchema, OPTIONS>

    const linkedValue = defaultedValue
    yield linkedValue as ParserYield<PrimitiveSchema, OPTIONS>
  }

  if (!isValidPrimitive(attribute, linkedValue)) {
    const { type } = attribute
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${path !== undefined ? ` '${path}'` : ''} should be a ${type}.`,
      path,
      payload: { received: linkedValue, expected: type }
    })
  }

  const { state } = attribute
  if (state.enum !== undefined && !(state.enum as unknown[]).includes(linkedValue)) {
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${
        path !== undefined ? ` '${path}'` : ''
      } should be one of: ${state.enum.map(String).join(', ')}.`,
      path,
      payload: { received: linkedValue, expected: state.enum }
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
    state.transform !== undefined
      ? (state.transform as Transformer).encode(parsedValue)
      : parsedValue
  return transformedValue
}
