import type { AttributeBasicValue, AttributeValue, RecordAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { parsePrimitiveAttributeClonedInput } from 'v1/validation/parseClonedInput/primitive'
import { $SET, $REMOVE } from 'v1/commands/updateItem/constants'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'
import { isObject } from 'v1/utils/validation/isObject'

import { hasSetOperation } from '../utils'

export const parseRecordExtension = (
  attribute: RecordAttribute,
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

  if (isObject(input)) {
    const parsedExtension: {
      [KEY in string]: AttributeValue<UpdateItemInputExtension> | $REMOVE
    } = {}

    for (const [inputKey, inputValue] of Object.entries(input)) {
      const parsedInputKey = parsePrimitiveAttributeClonedInput(attribute.keys, inputKey) as string

      // undefined is allowed
      if (inputValue === undefined) {
        continue
      }

      // $REMOVE is allowed
      if (inputValue === $REMOVE) {
        parsedExtension[parsedInputKey] = $REMOVE
      } else {
        parsedExtension[parsedInputKey] = parseAttributeClonedInput(
          attribute.elements,
          inputValue,
          options
        )
      }
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
