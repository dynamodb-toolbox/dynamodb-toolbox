import { isNumber } from '~/utils/validation/isNumber.js'
import { isObject } from '~/utils/validation/isObject.js'

import { Path } from '../../utils/path.js'
import type { ExpressionState } from './types.js'

export const pathTokens = (
  attr: string,
  prefix = '',
  state: ExpressionState,
  size = false
): string => {
  let tokens = ''

  Path.fromStr(attr).arrayPath.forEach((pathPart, index) => {
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

export const valueToken = (
  value: string | number | bigint | boolean | Uint8Array,
  prefix = '',
  state: ExpressionState
): string => {
  const token = `:c${prefix}_${state.valuesCursor}`
  state.ExpressionAttributeValues[token] = value
  state.valuesCursor++

  return token
}

export const attrOrValueTokens = (
  attrOrValue: string | number | bigint | boolean | Uint8Array | { attr: string },
  prefix = '',
  state: ExpressionState
): string => {
  if (isObject(attrOrValue) && 'attr' in attrOrValue) {
    return pathTokens(attrOrValue.attr, prefix, state)
  } else {
    return valueToken(attrOrValue, prefix, state)
  }
}
