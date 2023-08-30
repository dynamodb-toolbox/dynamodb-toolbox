import type { AttributeBasicValue, AttributeValue, SetAttribute } from 'v1/schema'
import type { ExtensionParser } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'

import type { ReferenceExtension, UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { $ADD, $DELETE } from 'v1/commands/updateItem/constants'
import { hasAddOperation, hasDeleteOperation } from 'v1/commands/updateItem/utils'

export const parseSetExtension = (
  attribute: SetAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const hasAdd = hasAddOperation(input)
  const hasDelete = hasDeleteOperation(input)

  if (hasAdd || hasDelete) {
    const parsedExtension: AttributeValue<ReferenceExtension> = {}

    if (hasAdd) {
      Object.assign(parsedExtension, {
        [$ADD]: parseAttributeClonedInput(attribute, input[$ADD])
      })
    }

    if (hasDelete) {
      Object.assign(parsedExtension, {
        [$DELETE]: parseAttributeClonedInput(attribute, input[$DELETE])
      })
    }

    return {
      isExtension: true,
      parsedExtension
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
