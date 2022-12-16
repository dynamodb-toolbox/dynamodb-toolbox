import { MapAttribute } from 'v1'
import { isObject } from 'v1/utils/validation'
import { isClosed } from 'v1/item/utils'

import { parseAttributePutCommandInput } from './attribute'
import { PutCommandInputParser } from './types'

export const parseMapAttributePutCommandInput: PutCommandInputParser<MapAttribute> = (
  itemOrMapAttribute,
  putItemInput
) => {
  const parsedPutItemInput = {} as any

  if (!isObject(putItemInput)) {
    // TODO
    throw new Error()
  }

  // Check that putItemInput entries match schema
  Object.entries(putItemInput).forEach(([attributeName, attributeInput]) => {
    const attributeSchema = itemOrMapAttribute.attributes[attributeName]

    if (attributeSchema !== undefined) {
      parsedPutItemInput[attributeName] = parseAttributePutCommandInput(
        attributeSchema,
        attributeInput
      )
    } else {
      if (isClosed(itemOrMapAttribute)) {
        // TODO
        throw new Error()
      } else {
        parsedPutItemInput[attributeName] = attributeInput
      }
    }
  })

  // Check that schema attributes entries are matched by putItemInput
  Object.entries(itemOrMapAttribute.attributes).forEach(([attributeName, attributeSchema]) => {
    if (parsedPutItemInput[attributeName] === undefined) {
      parsedPutItemInput[attributeName] = parseAttributePutCommandInput(attributeSchema, undefined)
    }

    // Maybe do swap in a second step and merge this step with addInitialDefaults
    if (attributeSchema.savedAs !== undefined) {
      parsedPutItemInput[attributeSchema.savedAs] = parsedPutItemInput[attributeName]
      delete parsedPutItemInput[attributeName]
    }
  })

  return parsedPutItemInput
}
