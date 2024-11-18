import type { MapAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isObject } from '~/utils/validation/isObject.js'

import { attrParser } from './attribute.js'
import type { ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { applyCustomValidation } from './utils.js'

export function* mapAttrParser<OPTIONS extends ParseAttrValueOptions = {}>(
  attribute: MapAttribute,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<MapAttribute, OPTIONS>, ParserReturn<MapAttribute, OPTIONS>> {
  const { valuePath = [], ...restOptions } = options
  const { mode = 'put', fill = true, transform = true } = restOptions
  const parsers: Record<string, Generator<any, any>> = {}
  let restEntries: [string, unknown][] = []

  const isInputValueObject = isObject(inputValue)
  if (isInputValueObject) {
    const additionalAttributeNames = new Set(Object.keys(inputValue))

    Object.entries(attribute.attributes)
      .filter(([, attr]) => mode !== 'key' || attr.key)
      .forEach(([attrName, attr]) => {
        parsers[attrName] = attrParser(attr, inputValue[attrName], {
          ...restOptions,
          valuePath: [...valuePath, attrName],
          defined: false
        })

        additionalAttributeNames.delete(attrName)
      })

    restEntries = [...additionalAttributeNames.values()].map(attrName => [
      attrName,
      cloneDeep(inputValue[attrName])
    ])
  }

  if (fill) {
    if (isInputValueObject) {
      const defaultedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attrName, attr]) => [attrName, attr.next().value])
          .filter(([, filledAttrValue]) => filledAttrValue !== undefined),
        ...restEntries
      ])
      const itemInput = yield defaultedValue

      const linkedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attrName, parser]) => [attrName, parser.next(itemInput).value])
          .filter(([, linkedAttrValue]) => linkedAttrValue !== undefined),
        ...restEntries
      ])
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue as ParserYield<MapAttribute, OPTIONS>

      const linkedValue = defaultedValue
      yield linkedValue as ParserYield<MapAttribute, OPTIONS>
    }
  }

  if (!isInputValueObject) {
    const { type } = attribute
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute${path !== undefined ? ` '${path}'` : ''} should be a ${type}.`,
      path,
      payload: { received: inputValue, expected: type }
    })
  }

  const parsedValue = Object.fromEntries(
    Object.entries(parsers)
      .map(([attrName, attrParser]) => [attrName, attrParser.next().value])
      .filter(([, attrValue]) => attrValue !== undefined)
  )
  if (parsedValue !== undefined) {
    applyCustomValidation(attribute, parsedValue, options)
  }

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = Object.fromEntries(
    Object.entries(parsers)
      .map(([attrName, attrParser]) => [
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attribute.attributes[attrName]!.savedAs ?? attrName,
        attrParser.next().value
      ])
      .filter(([, attrValue]) => attrValue !== undefined)
  )
  return transformedValue
}
