import { Attribute, RequiredOption } from 'v1'

import { parsePrimitiveAttributePutCommandInput } from './primitive'
import { parseSetAttributePutCommandInput } from './set'
import { parseListAttributePutCommandInput } from './list'
import { parseMapAttributePutCommandInput } from './map'
import { PutCommandInputParser } from './types'

export const requiringOptions = new Set<RequiredOption>(['always', 'onlyOnce', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

/**
 * Recursively parse the input of a PUT command for any attribute
 *
 * @param attribute Attribute
 * @param putCommandInput any
 * @return PutItemInput
 */
export const parseAttributePutCommandInput: PutCommandInputParser<Attribute> = (
  attribute,
  putCommandInput
) => {
  if (putCommandInput === undefined) {
    if (isRequired(attribute)) {
      throw new Error()
    } else {
      return undefined
    }
  }

  switch (attribute.type) {
    case 'any':
      return putCommandInput as any
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return parsePrimitiveAttributePutCommandInput(attribute, putCommandInput) as any
    case 'set':
      return parseSetAttributePutCommandInput(attribute, putCommandInput) as any
    case 'list':
      return parseListAttributePutCommandInput(attribute, putCommandInput) as any
    case 'map':
      return parseMapAttributePutCommandInput(attribute, putCommandInput) as any
  }
}
