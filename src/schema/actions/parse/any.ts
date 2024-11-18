import type { AnyAttribute } from '~/attributes/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'

import type { ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { applyCustomValidation } from './utils.js'

export function* anyAttrParser<OPTIONS extends ParseAttrValueOptions = {}>(
  attribute: AnyAttribute,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<ParserYield<AnyAttribute, OPTIONS>, ParserReturn<AnyAttribute, OPTIONS>> {
  const { fill = true, transform = true } = options

  let linkedValue = undefined
  if (fill) {
    const defaultedValue = cloneDeep(inputValue)
    yield defaultedValue

    linkedValue = defaultedValue
    yield linkedValue
  }

  const parsedValue = linkedValue ?? cloneDeep(inputValue)
  if (parsedValue !== undefined) {
    applyCustomValidation(attribute, parsedValue, options)
  }

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = parsedValue
  return transformedValue
}
