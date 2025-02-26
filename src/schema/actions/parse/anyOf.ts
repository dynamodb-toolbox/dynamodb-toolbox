import type { AnyOfSchema } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import { cloneDeep } from '~/utils/cloneDeep.js'

import { attrParser } from './attribute.js'
import type { ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { applyCustomValidation } from './utils.js'

export function* anyOfAttributeParser<OPTIONS extends ParseAttrValueOptions = {}>(
  attribute: AnyOfSchema,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<AnyOfSchema, OPTIONS>, ParserReturn<AnyOfSchema, OPTIONS>> {
  const { fill = true, transform = true, valuePath = [] } = options

  let parser: Generator<any, any> | undefined = undefined
  let _defaultedValue = undefined
  let _linkedValue = undefined
  let _parsedValue = undefined

  for (const elementAttribute of attribute.elements) {
    try {
      parser = attrParser(elementAttribute, inputValue, options)
      if (fill) {
        _defaultedValue = parser.next().value
        // Note: Links cannot be used in anyOf elements or sub elements for this reason (we need the return of the yield)
        _linkedValue = parser.next().value
      }
      _parsedValue = parser.next().value
      break
    } catch (error) {
      parser = undefined
      _defaultedValue = undefined
      _linkedValue = undefined
      _parsedValue = undefined
      continue
    }
  }

  if (fill) {
    const defaultedValue = _defaultedValue ?? cloneDeep(inputValue)
    yield defaultedValue

    const linkedValue = _linkedValue ?? defaultedValue
    yield linkedValue
  }

  const parsedValue = _parsedValue
  if (parser === undefined || parsedValue === undefined) {
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${
        path !== undefined ? ` '${path}'` : ''
      } does not match any of the possible sub-types.`,
      path,
      payload: { received: inputValue }
    })
  }
  if (parsedValue !== undefined) {
    applyCustomValidation(attribute, parsedValue, options)
  }

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = parser.next().value
  return transformedValue
}
