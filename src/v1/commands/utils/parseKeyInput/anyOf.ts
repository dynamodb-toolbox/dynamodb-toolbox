import type { AnyOfAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'

import { parseAttributeKeyInput } from './attribute'
import type {
  AnyOfAttributeClonedInputsWithDefaults,
  ParsedAnyOfAttributeCommandInput
} from 'v1/commands/types'

export const parseAnyOfAttributeKeyInput = (
  anyOfAttribute: AnyOfAttribute,
  input: PossiblyUndefinedResolvedAttribute
): ParsedAnyOfAttributeCommandInput => {
  let parsedKeyInput: ParsedAnyOfAttributeCommandInput | undefined = undefined

  const { clonedInputsWithDefaults } = input as AnyOfAttributeClonedInputsWithDefaults

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
    // TODO
    throw new Error()
  }

  return parsedKeyInput
}
