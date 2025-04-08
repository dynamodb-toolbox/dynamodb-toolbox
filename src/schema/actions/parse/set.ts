import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { SetSchema } from '~/schema/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isSet } from '~/utils/validation/isSet.js'

import type { ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { schemaParser } from './schema.js'
import { applyCustomValidation } from './utils.js'

export function* setSchemaParser<OPTIONS extends ParseAttrValueOptions = {}>(
  schema: SetSchema,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<SetSchema, OPTIONS>, ParserReturn<SetSchema, OPTIONS>> {
  const { valuePath = [], ...restOptions } = options
  const { fill = true, transform = true } = restOptions

  let parsers: Generator<any, any>[] = []

  const isInputValueSet = isSet(inputValue)
  if (isInputValueSet) {
    parsers = [...inputValue.values()].map((element, index) =>
      schemaParser(schema.elements, element, {
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
      yield defaultedValue as ParserYield<SetSchema, OPTIONS>

      const linkedValue = defaultedValue
      yield linkedValue as ParserYield<SetSchema, OPTIONS>
    }
  }

  if (!isInputValueSet) {
    const { type } = schema
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${path !== undefined ? ` '${path}'` : ''} should be a ${type}.`,
      path,
      payload: { received: inputValue, expected: type }
    })
  }

  const parsedValue = new Set(parsers.map(parser => parser.next().value))
  if (parsedValue !== undefined) {
    applyCustomValidation(schema, parsedValue, options)
  }

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = new Set(parsers.map(parser => parser.next().value))
  return transformedValue
}
