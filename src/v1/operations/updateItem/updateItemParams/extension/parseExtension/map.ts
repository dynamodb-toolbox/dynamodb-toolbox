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
    return {
      isExtension: true,
      *extensionParser() {
        const parser = parseAttributeClonedInput<never, UpdateItemInputExtension>(
          attribute,
          input[$SET],
          // Should a simple map of valid elements (not extended)
          { ...options, parseExtension: undefined }
        )

        const clonedValue = { [$SET]: parser.next().value }
        yield clonedValue

        const parsedValue = { [$SET]: parser.next().value }
        yield parsedValue

        const collapsedValue = { [$SET]: parser.next().value }
        return collapsedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
