import type { AttributeValue, AttributeBasicValue, MapAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SET } from 'v1/operations/updateItem/constants'
import { hasSetOperation } from 'v1/operations/updateItem/utils'

export const parseMapExtension = (
  attribute: MapAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasSetOperation(input)) {
    const parser = parseAttributeClonedInput<never>(attribute, input[$SET], {
      ...options,
      // Should a simple map of valid elements (not extended)
      parseExtension: undefined
    })

    return {
      isExtension: true,
      *extensionParser() {
        yield { [$SET]: parser.next().value }
        return { [$SET]: parser.next().value }
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
