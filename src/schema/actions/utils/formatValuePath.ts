import type { CharsToEscape } from '~/schema/types/paths.js'
import { isNumber } from '~/utils/validation/isNumber.js'
import { isString } from '~/utils/validation/isString.js'

const charsToEscape: CharsToEscape[] = ['[', ']', '.']
export const formatValuePath = (valuePath: (string | number)[] | undefined): string | undefined => {
  if (valuePath === undefined || valuePath.length === 0) {
    return undefined
  }

  let path = ''
  let isRoot = true

  for (const valuePathPart of valuePath) {
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
