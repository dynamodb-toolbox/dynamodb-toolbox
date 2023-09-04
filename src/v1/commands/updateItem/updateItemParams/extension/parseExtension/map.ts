import type {
  AttributeValue,
  AttributeBasicValue,
  MapAttribute,
  MapAttributeBasicValue
} from 'v1/schema'
import type { ExtensionParser } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'

import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { $SET } from 'v1/commands/updateItem/constants'
import { hasSetOperation } from 'v1/commands/updateItem/utils'

export const parseMapExtension = (
  attribute: MapAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasSetOperation(input)) {
    return {
      isExtension: true,
      parsedExtension: {
        /**
         * @debt type "Maybe this cast can be omitted by clever typing of parseAttributeClonedInput"
         */
        [$SET]: parseAttributeClonedInput<never>(attribute, input[$SET]) as MapAttributeBasicValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
