import type { MapAttribute, AttributeBasicValue } from 'v1/schema/attributes/index.js'
import { Parser, ExtensionParser, ExtensionParserOptions } from 'v1/schema/actions/parse/index.js'

import type { UpdateItemInputExtension } from '../../types.js'
import { $SET } from '../../constants.js'
import { isSetUpdate } from '../../utils.js'

export const parseMapExtension = (
  attribute: MapAttribute,
  input: unknown,
  { transform = true }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (isSetUpdate(input) && input[$SET] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(attribute).start(input[$SET], { fill: false, transform })

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
