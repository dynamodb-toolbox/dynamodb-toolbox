import type { AttributeBasicValue, AttributeValue, PrimitiveAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
import { $ADD } from 'v1/commands/updateItem/constants'

import { hasAddOperation } from '../utils'

export const parseNumberExtension = (
  attribute: PrimitiveAttribute<'number'>,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const hasAdd = hasAddOperation(input)

  if (hasAdd) {
    const parsedExtension: AttributeValue<UpdateItemInputExtension> = {}

    if (hasAdd) {
      Object.assign(parsedExtension, {
        [$ADD]: parseAttributeClonedInput(attribute, input[$ADD], options)
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
