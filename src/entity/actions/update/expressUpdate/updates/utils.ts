import { DynamoDBToolboxError } from '~/errors/index.js'
import { Finder } from '~/schema/actions/finder/finder.js'
import type { Path } from '~/schema/actions/utils/path.js'
import type { Schema, TransformedValue, ValidValue } from '~/schema/index.js'
import { isNumber } from '~/utils/validation/isNumber.js'

import { $GET, isGetting } from '../../symbols/index.js'
import type { ReferenceExtension, UpdateItemInputExtension } from '../../types.js'
import type { ExpressionPrefix, ExpressionState } from '../types.js'

/**
 * Express an attribute path as expression name tokens, registering new ones as needed.
 */
export const pathTokens = (
  path: Path,
  prefix: ExpressionPrefix,
  state: ExpressionState
): string => {
  let tokens = ''

  path.arrayPath.forEach((pathPart, index) => {
    if (isNumber(pathPart)) {
      tokens += `[${pathPart}]`
      return
    }

    let token = state.tokens[prefix][pathPart]

    if (token === undefined) {
      token = `#${prefix}_${state.nameCursors[prefix]}`
      state.tokens[prefix][pathPart] = token
      state.ExpressionAttributeNames[token] = pathPart
      state.nameCursors[prefix]++
    }

    if (index > 0) {
      tokens += '.'
    }

    tokens += token
  })

  return tokens
}

/**
 * Register a value in the expression attribute values and return its token.
 */
export const valueToken = (
  value: TransformedValue<Schema, { mode: 'update' }>,
  prefix: ExpressionPrefix,
  state: ExpressionState
): string => {
  const token = `:${prefix}_${state.valueCursors[prefix]}`
  state.ExpressionAttributeValues[token] = value
  state.valueCursors[prefix]++

  return token
}

/**
 * Express a value, or a `$get` reference and its optional fallback, as expression tokens.
 */
export const refOrValueTokens = (
  refOrValue: TransformedValue<Schema, { mode: 'update'; extension: UpdateItemInputExtension }>,
  prefix: ExpressionPrefix,
  state: ExpressionState
): string => {
  if (isGetting(refOrValue)) {
    // TODO: Fix this cast
    const [reference, fallback] = refOrValue[$GET] as [
      string,
      ValidValue<Schema, { mode: 'update'; extension: ReferenceExtension }> | undefined
    ]

    const [firstMatchingSubSchema] = new Finder(state.rootSchema).search(reference)
    if (firstMatchingSubSchema === undefined) {
      throw new DynamoDBToolboxError('actions.invalidExpressionAttributePath', {
        message: `Unable to match update reference with schema: ${reference}`,
        payload: { attributePath: reference }
      })
    }

    if (fallback === undefined) {
      return pathTokens(firstMatchingSubSchema.transformedPath, prefix, state)
    } else {
      let Expression = 'if_not_exists('
      Expression += pathTokens(firstMatchingSubSchema.transformedPath, prefix, state)
      Expression += ', '
      Expression += refOrValueTokens(fallback, prefix, state)
      Expression += ')'
      return Expression
    }
  }

  return valueToken(refOrValue, prefix, state)
}
