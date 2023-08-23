import type { AttributeBasicValue, AttributeValue, MapAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'

import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { $SET } from 'v1/commands/updateItem/constants'
import { hasSetOperation } from 'v1/commands/updateItem/utils'

export const parseMapExtension = (
  attribute: MapAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasSetOperation(input)) {
    // Omit parseExtension as $set means non-extended values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { parseExtension: _, ...restOptions } = options

    return {
      isExtension: true,
      parsedExtension: {
        [$SET]: parseAttributeClonedInput(attribute, input[$SET], restOptions)
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
