import type { RequiredOption, Attribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { DynamoDBToolboxError } from 'v1/errors'

import { parsePrimitiveAttributePutCommandInput } from './primitive'
import { parseSetAttributePutCommandInput } from './set'
import { parseListAttributePutCommandInput } from './list'
import { parseMapAttributePutCommandInput } from './map'
import { parseRecordAttributePutCommandInput } from './record'
import { parseAnyOfAttributePutCommandInput } from './anyOf'

export const requiringOptions = new Set<RequiredOption>(['always', 'onlyOnce', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

/**
 * Recursively parse the input of a PUT command for any attribute
 *
 * @param attribute Attribute
 * @param input any
 * @return PutItemInput
 */
export const parseAttributePutCommandInput = (
  attribute: Attribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (input === undefined) {
    if (isRequired(attribute)) {
      throw new DynamoDBToolboxError('putItemCommand.attributeRequired', {
        message: `Attribute ${attribute.path} is required`,
        path: attribute.path
      })
    } else {
      return undefined
    }
  }

  switch (attribute.type) {
    case 'any':
      return input
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return parsePrimitiveAttributePutCommandInput(attribute, input)
    case 'set':
      return parseSetAttributePutCommandInput(attribute, input)
    case 'list':
      return parseListAttributePutCommandInput(attribute, input)
    case 'map':
      return parseMapAttributePutCommandInput(attribute, input)
    case 'record':
      return parseRecordAttributePutCommandInput(attribute, input)
    case 'anyOf':
      return parseAnyOfAttributePutCommandInput(attribute, input)
  }
}
