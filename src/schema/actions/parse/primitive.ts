import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatArrayPath } from '~/schema/actions/utils/formatArrayPath.js'
import type { PrimitiveSchema } from '~/schema/index.js'
import type { Transformer } from '~/transformers/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { applyCustomValidation } from './utils.js'

export function* primitiveSchemaParser<OPTIONS extends ParseAttrValueOptions = {}>(
  schema: PrimitiveSchema,
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

  if (!isValidPrimitive(schema, linkedValue)) {
    const { type } = schema
    const path = formatArrayPath(valuePath)

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${path !== undefined ? ` '${path}'` : ''} should be a ${type}.`,
      path,
      payload: { received: linkedValue, expected: type }
    })
  }

  const { props } = schema
  if (props.enum !== undefined && !(props.enum as unknown[]).includes(linkedValue)) {
    const path = formatArrayPath(valuePath)

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${
        path !== undefined ? ` '${path}'` : ''
      } should be one of: ${props.enum.map(String).join(', ')}.`,
      path,
      payload: { received: linkedValue, expected: props.enum }
    })
  }

  const parsedValue = linkedValue
  applyCustomValidation(schema, parsedValue, options)

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue =
    props.transform !== undefined
      ? (props.transform as Transformer).encode(parsedValue)
      : parsedValue
  return transformedValue
}
