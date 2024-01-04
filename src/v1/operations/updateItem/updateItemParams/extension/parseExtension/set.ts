import type { AttributeBasicValue, AttributeValue, SetAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $ADD, $DELETE } from 'v1/operations/updateItem/constants'
import { hasAddOperation, hasDeleteOperation } from 'v1/operations/updateItem/utils'

export const parseSetExtension = (
  attribute: SetAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const hasAdd = hasAddOperation(input)
  const hasDelete = hasDeleteOperation(input)

  if (hasAdd || hasDelete) {
    if (hasAdd) {
      const parser = parseAttributeClonedInput(attribute, input[$ADD], {
        ...options,
        // Should a simple set of valid elements (not extended)
        parseExtension: undefined
      })

      return {
        isExtension: true,
        *extensionParser() {
          yield { [$ADD]: parser.next().value }
          return { [$ADD]: parser.next().value }
        }
      }
    }

    if (hasDelete) {
      const parser = parseAttributeClonedInput(attribute, input[$DELETE], {
        ...options,
        // Should a simple set of valid elements (not extended)
        parseExtension: undefined
      })

      return {
        isExtension: true,
        *extensionParser() {
          yield { [$DELETE]: parser.next().value }
          return { [$DELETE]: parser.next().value }
        }
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
