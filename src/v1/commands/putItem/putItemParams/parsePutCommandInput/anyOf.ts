import { AnyOfAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { DynamoDBToolboxError } from 'v1/errors'
import type {
  AnyOfAttributeClonedInputsWithDefaults,
  ParsedAnyOfAttributeCommandInput
} from 'v1/commands/types'

import { parseAttributePutCommandInput } from './attribute'

export const parseAnyOfAttributePutCommandInput = (
  anyOfAttribute: AnyOfAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  let parsedPutItemInput: ParsedAnyOfAttributeCommandInput | undefined = undefined

  const {
    originalInput,
    clonedInputsWithDefaults
  } = input as AnyOfAttributeClonedInputsWithDefaults

  let subSchemaIndex = 0
  while (parsedPutItemInput === undefined && subSchemaIndex < anyOfAttribute.elements.length) {
    try {
      const element = anyOfAttribute.elements[subSchemaIndex]
      const input = clonedInputsWithDefaults[subSchemaIndex]
      // TODO: Maybe we could use proxies instead ? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
      parsedPutItemInput = {
        subSchemaIndex,
        parsedInput: parseAttributePutCommandInput(element, input)
      }
      break
    } catch (error) {
      subSchemaIndex += 1
      continue
    }
  }

  if (parsedPutItemInput === undefined) {
    throw new DynamoDBToolboxError('putItemCommand.invalidAttributeInput', {
      message: `Attribute ${anyOfAttribute.path} does not match any of the possible sub-types`,
      path: anyOfAttribute.path,
      payload: {
        received: originalInput
      }
    })
  }

  return parsedPutItemInput
}
