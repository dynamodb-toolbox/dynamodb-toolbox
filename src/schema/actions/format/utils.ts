import type { CharsToEscape } from '~/schema/types/paths.js'
import { isNumber } from '~/utils/validation/isNumber.js'
import { isString } from '~/utils/validation/isString.js'

export const sanitize = (str: string): string =>
  str.replace(/\\/g, '\\\\').replace(/[-[\]/{}()*+?.^$|]/g, '\\$&')

export const matchProjection = (
  attributeNameRegex: RegExp,
  projectedAttributes?: string[]
):
  | { isProjected: false; childrenAttributes?: never }
  | { isProjected: true; childrenAttributes?: string[] } => {
  if (projectedAttributes === undefined) {
    return { isProjected: true }
  }

  const childrenAttributes: string[] = []
  for (const attributePath of projectedAttributes) {
    const attributeMatch = attributePath.match(attributeNameRegex)

    if (attributeMatch !== null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const firstMatch = attributeMatch[0]!
      childrenAttributes.push(attributePath.slice(firstMatch.length))
    }
  }

  if (childrenAttributes.length === 0) {
    return { isProjected: false }
  }

  if (childrenAttributes.some(attribute => attribute === '')) {
    // We do not add childrenAttributes as we want all of them
    return { isProjected: true }
  }

  return { isProjected: true, childrenAttributes }
}

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
