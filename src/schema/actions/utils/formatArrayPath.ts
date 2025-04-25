import type { CharsToEscape } from '~/schema/types/paths.js'
import { isNumber } from '~/utils/validation/isNumber.js'
import { isString } from '~/utils/validation/isString.js'

import type { ArrayPath, StrPath } from './types.js'

const charsToEscape: CharsToEscape[] = ['[', ']', '.']

export const formatArrayPath = (arrayPath: ArrayPath): StrPath => {
  let path = ''
  let isRoot = true

  for (const valuePathPart of arrayPath) {
    if (isString(valuePathPart)) {
      const shouldBeEscaped = charsToEscape.some(charToEscape =>
        valuePathPart.includes(charToEscape)
      )

      if (shouldBeEscaped) {
        path += `['${valuePathPart}']`
      } else {
        path += `${isRoot ? '' : '.'}${valuePathPart}`
      }
    }

    if (isNumber(valuePathPart)) {
      path += `[${valuePathPart}]`
    }

    isRoot = false
  }

  return path
}
