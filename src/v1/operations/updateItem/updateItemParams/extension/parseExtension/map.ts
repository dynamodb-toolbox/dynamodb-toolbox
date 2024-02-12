import type { AttributeValue, AttributeBasicValue, MapAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/schema/actions/parse/types'
import { attributeParser } from 'v1/schema/actions/parse'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SET } from 'v1/operations/updateItem/constants'
import { hasSetOperation } from 'v1/operations/updateItem/utils'

export const parseMapExtension = (
  attribute: MapAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { fill = true, transform = true } = options

  if (hasSetOperation(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = attributeParser<never, UpdateItemInputExtension>(
          attribute,
          input[$SET],
          // Should a simple map of valid elements (not extended)
          { ...options, parseExtension: undefined }
        )

        if (fill) {
          const defaultedValue = { [$SET]: parser.next().value }
          yield defaultedValue

          const linkedValue = { [$SET]: parser.next().value }
          yield linkedValue
        }

        const parsedValue = { [$SET]: parser.next().value }

        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$SET]: parser.next().value }
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
