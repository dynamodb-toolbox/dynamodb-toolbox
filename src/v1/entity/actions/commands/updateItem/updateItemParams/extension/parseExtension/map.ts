import type { MapAttribute, AttributeBasicValue } from 'v1/schema/attributes'
import { Parser, ExtensionParser, ExtensionParserOptions } from 'v1/schema/actions/parse'

import type { UpdateItemInputExtension } from '../../../types'
import { $SET } from '../../../constants'
import { hasSetOperation } from '../../../utils'

export const parseMapExtension = (
  attribute: MapAttribute,
  input: unknown,
  { transform = true }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasSetOperation(input) && input[$SET] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = attribute.build(Parser).start(input[$SET], { fill: false, transform })

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