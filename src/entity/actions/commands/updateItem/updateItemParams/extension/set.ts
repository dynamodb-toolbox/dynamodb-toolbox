import { ExtensionParser, ExtensionParserOptions, Parser } from '~/schema/actions/parse/index.js'
import type { AttributeBasicValue, SetAttribute } from '~/schema/attributes/index.js'

import { $ADD, $DELETE } from '../../constants.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { isAddUpdate, isDeleteUpdate } from '../../utils.js'

export const parseSetExtension = (
  attribute: SetAttribute,
  input: unknown,
  { transform = true }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (isAddUpdate(input) && input[$ADD] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(attribute).start(input[$ADD], { fill: false, transform })

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

  if (isDeleteUpdate(input) && input[$DELETE] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(attribute).start(input[$DELETE], { fill: false, transform })

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
