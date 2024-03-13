import type { AttributeBasicValue, SetAttribute } from 'v1/schema'
import type { ExtensionParser, ExtensionParserOptions } from 'v1/schema/actions/parse/types'
import { Parser } from 'v1/schema/actions/parse'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $ADD, $DELETE } from 'v1/operations/updateItem/constants'
import { hasAddOperation, hasDeleteOperation } from 'v1/operations/updateItem/utils'

export const parseSetExtension = (
  attribute: SetAttribute,
  input: unknown,
  { transform = true }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasAddOperation(input) && input[$ADD] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = attribute.build(Parser).start(input[$ADD], { fill: false, transform })

        const parsedValue = { [$ADD]: parser.next().value }
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$ADD]: parser.next().value }
        return transformedValue
      }
    }
  }

  if (hasDeleteOperation(input) && input[$DELETE] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = attribute.build(Parser).start(input[$DELETE], { fill: false, transform })

        const parsedValue = { [$DELETE]: parser.next().value }
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$DELETE]: parser.next().value }
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
