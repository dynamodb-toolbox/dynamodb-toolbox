import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatArrayPath } from '~/schema/actions/utils/formatArrayPath.js'
import type { AnyOfSchema } from '~/schema/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isObject } from '~/utils/validation/isObject.js'
import { isString } from '~/utils/validation/isString.js'

import type { ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { schemaParser } from './schema.js'
import { applyCustomValidation } from './utils.js'

export function* anyOfSchemaParser<OPTIONS extends ParseAttrValueOptions = {}>(
  schema: AnyOfSchema,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<AnyOfSchema, OPTIONS>, ParserReturn<AnyOfSchema, OPTIONS>> {
  const { discriminator } = schema.props
  const { fill = true, transform = true, valuePath } = options

  let parser: Generator<any, any> | undefined = undefined
  let _defaultedValue = undefined
  let _linkedValue = undefined
  let _parsedValue = undefined

  if (discriminator !== undefined && isObject(inputValue) && discriminator in inputValue) {
    const discriminatorValue = inputValue[discriminator]
    const matchingElement = isString(discriminatorValue)
      ? schema.match(discriminatorValue)
      : undefined

    if (matchingElement !== undefined) {
      parser = schemaParser(matchingElement, inputValue, options)
      if (fill) {
        _defaultedValue = parser.next().value
        _linkedValue = parser.next().value
      }
      _parsedValue = parser.next().value
    }
  }

  if (parser === undefined) {
    for (const elementAttribute of schema.elements) {
      try {
        parser = schemaParser(elementAttribute, inputValue, options)
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
  }

  if (fill) {
    const defaultedValue = _defaultedValue ?? cloneDeep(inputValue)
    yield defaultedValue

    const linkedValue = _linkedValue ?? defaultedValue
    yield linkedValue
  }

  const parsedValue = _parsedValue
  if (parser === undefined || parsedValue === undefined) {
    const path = valuePath !== undefined ? formatArrayPath(valuePath) : undefined

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${
        path !== undefined ? ` '${path}'` : ''
      } does not match any of the possible sub-types.`,
      path,
      payload: { received: inputValue }
    })
  }

  if (parsedValue !== undefined) {
    applyCustomValidation(schema, parsedValue, options)
  }

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = parser.next().value
  return transformedValue
}
