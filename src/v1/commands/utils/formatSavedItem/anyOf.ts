import { ResolvedAttribute, AnyOfAttribute } from 'v1'

import { parseSavedAttribute } from './attribute'

export const parseSavedAnyOfAttribute = (
  attribute: AnyOfAttribute,
  input: ResolvedAttribute
): ResolvedAttribute => {
  let parsedAttribute: ResolvedAttribute | undefined = undefined
  let firstError: unknown = undefined

  for (const element of attribute.elements) {
    try {
      parsedAttribute = parseSavedAttribute(element, input)
      // TODO: Here we are not able to correctly parse as parsing doesn't throw an error
      break
    } catch (error) {
      if (firstError === undefined) {
        firstError = error
      }
    }
  }

  if (parsedAttribute === undefined) {
    if (firstError !== undefined) {
      throw firstError
    } else {
      // TODO
      throw new Error()
    }
  }

  return parsedAttribute
}
