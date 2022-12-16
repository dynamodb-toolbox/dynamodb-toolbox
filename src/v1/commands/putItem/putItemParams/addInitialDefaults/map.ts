import cloneDeep from 'lodash.clonedeep'

import { PossiblyUndefinedResolvedAttribute, MapAttribute } from 'v1'
import { isObject } from 'v1/utils/validation'

import { addAttributeInitialDefaults } from './attribute'

export const addMapInitialDefaults = (
  mapAttribute: MapAttribute,
  putItemInput: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (putItemInput === undefined) {
    return undefined
  }

  if (!isObject(putItemInput)) {
    return cloneDeep(putItemInput)
  }

  const putItemInputWithInitialDefaults: { [key: string]: PossiblyUndefinedResolvedAttribute } = {}

  const additionalAttributes: Set<string> = new Set(...Object.keys(putItemInput))

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    putItemInputWithInitialDefaults[attributeName] = addAttributeInitialDefaults(
      attribute,
      putItemInput[attributeName]
    )

    additionalAttributes.delete(attributeName)
  })

  additionalAttributes.forEach(attributeName => {
    putItemInputWithInitialDefaults[attributeName] = cloneDeep(putItemInput[attributeName])
  })

  return putItemInputWithInitialDefaults
}
