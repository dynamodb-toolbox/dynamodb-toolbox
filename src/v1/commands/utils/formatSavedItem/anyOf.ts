import type { PossiblyUndefinedResolvedAttribute, AnyOfAttribute } from 'v1'

import { parseSavedAttribute } from './attribute'

export const parseSavedAnyOfAttribute = (
  attribute: AnyOfAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  let parsedAttribute: PossiblyUndefinedResolvedAttribute | undefined = undefined

  for (const element of attribute.elements) {
    try {
      parsedAttribute = parseSavedAttribute(element, input)
      break
    } catch (error) {
      continue
    }
  }

  if (parsedAttribute === undefined) {
    // TODO
    throw new Error()
  }

  return parsedAttribute
}
