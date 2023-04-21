import type { AnyOfAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import type {
  AnyOfAttributeClonedInputsWithDefaults,
  ParsedAnyOfAttributeCommandInput
} from 'v1/commands/types'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeKeyInput } from './attribute'

export const parseAnyOfAttributeKeyInput = (
  anyOfAttribute: AnyOfAttribute,
  input: PossiblyUndefinedResolvedAttribute
): ParsedAnyOfAttributeCommandInput => {
  let parsedKeyInput: ParsedAnyOfAttributeCommandInput | undefined = undefined

  const {
    originalInput,
    clonedInputsWithDefaults
  } = input as AnyOfAttributeClonedInputsWithDefaults

  let subSchemaIndex = 0
  while (parsedKeyInput === undefined && subSchemaIndex < anyOfAttribute.elements.length) {
    try {
      const element = anyOfAttribute.elements[subSchemaIndex]
      const input = clonedInputsWithDefaults[subSchemaIndex]
      // TODO: Maybe we could use proxies instead ? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
      parsedKeyInput = {
        subSchemaIndex,
        parsedInput: parseAttributeKeyInput(element, input)
      }
      break
    } catch (error) {
      subSchemaIndex += 1
      continue
    }
  }

  if (parsedKeyInput === undefined) {
    throw new DynamoDBToolboxError('commands.parseKeyInput.invalidAttributeInput', {
      message: `Attribute ${anyOfAttribute.path} does not match any of the possible sub-types`,
      path: anyOfAttribute.path,
      payload: {
        received: originalInput
      }
    })
  }

  return parsedKeyInput
}
