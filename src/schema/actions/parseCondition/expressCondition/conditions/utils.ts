import { Path } from '~/schema/actions/utils/path.js'
import { isNumber } from '~/utils/validation/isNumber.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { ExpressionState } from '../types.js'

export const pathTokens = (
  attr: string,
  prefix = '',
  state: ExpressionState,
  size = false
): string => {
  let tokens = ''

  new Path(attr).arrayPath.forEach((pathPart, index) => {
    if (isNumber(pathPart)) {
      tokens += `[${pathPart}]`
      return
    }

    let token = state.tokens[pathPart]

    if (token === undefined) {
      token = `#c${prefix}_${state.namesCursor}`
      state.tokens[pathPart] = token
      state.ExpressionAttributeNames[token] = pathPart
      state.namesCursor++
    }

    if (index > 0) {
      tokens += '.'
    }

    tokens += token
  })

  if (size) {
    tokens = ['size(', tokens, ')'].join('')
  }

  return tokens
}

export const valueToken = (value: unknown, prefix = '', state: ExpressionState): string => {
  const token = `:c${prefix}_${state.valuesCursor}`
  state.ExpressionAttributeValues[token] = value
  state.valuesCursor++

  return token
}

// NOTE: Simple object check is enough as objects are not valid condition values
const isAttr = (attrOrValue: unknown): attrOrValue is { attr: string } => isObject(attrOrValue)

export const attrOrValueTokens = (
  attrOrValue: unknown,
  prefix = '',
  state: ExpressionState
): string => {
  if (isAttr(attrOrValue)) {
    return pathTokens(attrOrValue.attr, prefix, state)
  } else {
    return valueToken(attrOrValue, prefix, state)
  }
}
