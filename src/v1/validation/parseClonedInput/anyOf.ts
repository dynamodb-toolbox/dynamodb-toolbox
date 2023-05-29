import type { AnyOfAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/schema'
import type {
  AnyOfAttributeClonedInputsWithDefaults,
  ParsedAnyOfAttributeCommandInput
} from 'v1/commands/types/intermediaryAnyOfAttributeState'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions } from './types'

export const parseAnyOfAttributeClonedInput = (
  anyOfAttribute: AnyOfAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  parsingOptions: ParsingOptions = {}
): ParsedAnyOfAttributeCommandInput => {
  let parsedInput: ParsedAnyOfAttributeCommandInput | undefined = undefined

  const {
    originalInput,
    clonedInputsWithDefaults
  } = input as AnyOfAttributeClonedInputsWithDefaults

  let subSchemaIndex = 0
  while (parsedInput === undefined && subSchemaIndex < anyOfAttribute.elements.length) {
    try {
      const element = anyOfAttribute.elements[subSchemaIndex]
      const input = clonedInputsWithDefaults[subSchemaIndex]
      // TODO: Maybe we could use proxies instead ? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
      parsedInput = {
        subSchemaIndex,
        parsedInput: parseAttributeClonedInput(element, input, parsingOptions)
      }
      break
    } catch (error) {
      subSchemaIndex += 1
      continue
    }
  }

  if (parsedInput === undefined) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${anyOfAttribute.path} does not match any of the possible sub-types`,
      path: anyOfAttribute.path,
      payload: {
        received: originalInput
      }
    })
  }

  return parsedInput
}
