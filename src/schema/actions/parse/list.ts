import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatArrayPath } from '~/schema/actions/utils/formatArrayPath.js'
import type { ListSchema } from '~/schema/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isArray } from '~/utils/validation/isArray.js'

import type { ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { schemaParser } from './schema.js'
import { applyCustomValidation } from './utils.js'

export function* listSchemaParser<OPTIONS extends ParseAttrValueOptions = {}>(
  schema: ListSchema,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<ListSchema, OPTIONS>, ParserReturn<ListSchema, OPTIONS>> {
  const { valuePath, ...restOptions } = options
  const { fill = true, transform = true } = restOptions

  let parsers: Generator<any, any>[] = []

  const isInputValueArray = isArray(inputValue)
  if (isInputValueArray) {
    parsers = inputValue.map((element, index) =>
      schemaParser(schema.elements, element, {
        ...restOptions,
        valuePath: [...(valuePath ?? []), index],
        defined: false
      })
    )
  }

  if (fill) {
    if (isInputValueArray) {
      const defaultedValue = parsers.map(parser => parser.next().value)
      const itemInput = yield defaultedValue

      const linkedValue = parsers.map(parser => parser.next(itemInput).value)
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue as ParserYield<ListSchema, OPTIONS>

      const linkedValue = defaultedValue
      yield linkedValue as ParserYield<ListSchema, OPTIONS>
    }
  }

  if (!isInputValueArray) {
    const { type } = schema
    const path = valuePath !== undefined ? formatArrayPath(valuePath) : undefined

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${path !== undefined ? ` '${path}'` : ''} should be a ${type}.`,
      path,
      payload: { received: inputValue, expected: type }
    })
  }

  const parsedValue = parsers.map(parser => parser.next().value)
  if (parsedValue !== undefined) {
    applyCustomValidation(schema, parsedValue, options)
  }

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = parsers.map(parser => parser.next().value)
  return transformedValue
}
